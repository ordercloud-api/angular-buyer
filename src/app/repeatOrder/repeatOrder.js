angular.module('orderCloud')
    .factory('RepeatOrderFactory', RepeatOrderFactory)
    .controller('RepeatOrderCtrl', RepeatOrderCtrl)
    .controller('RepeatOrderModalCtrl', RepeatOrderModalCtrl)
    .component('ordercloudRepeatOrder', {
        templateUrl: 'repeatOrder/templates/repeatOrder.component.html',
        controller: RepeatOrderCtrl,
        bindings: {
            currentOrderId: '<',
            originalOrderId: '<'
        }
    });

function RepeatOrderCtrl(toastr, RepeatOrderFactory, $uibModal) {
    var vm = this;

    vm.$onInit = function() {
        if (vm.orderid === 'undefined') toastr.error('repeat order component is not configured correctly. orderid is a required attribute', 'Error');
    };

    vm.openReorderModal = function(){
        $uibModal.open({
            templateUrl: 'repeatOrder/templates/repeatOrder.modal.html',
            controller:  RepeatOrderModalCtrl,
            controllerAs: 'repeatModal',
            size: 'md',
            resolve: {
                OrderID: function() {
                    return vm.currentOrderId;
                },
                LineItems: function() {
                    return RepeatOrderFactory.GetValidLineItems(vm.originalOrderId);
                }
            }
        });
    };
}

function RepeatOrderModalCtrl(LineItems, OrderID, $uibModalInstance, $state, RepeatOrderFactory){
    var vm = this;
    vm.orderid = OrderID;
    vm.invalidLI = LineItems.invalid;
    vm.validLI = LineItems.valid;


    vm.cancel = function(){
        $uibModalInstance.dismiss();
    };

    vm.submit = function(){
        vm.loading = {
            message:'Adding Products to Cart'
        };
        vm.loading.promise = RepeatOrderFactory.AddLineItemsToCart(vm.validLI, vm.orderid)
            .then(function(){
                $uibModalInstance.close();
                $state.go('cart', {}, {reload: true});
            });
    };
}

function RepeatOrderFactory($q, $rootScope, toastr, $exceptionHandler, OrderCloud, ocLineItems) {
    return {
        GetValidLineItems: getValidLineItems,
        AddLineItemsToCart: addLineItemsToCart
    };

    function getValidLineItems(originalOrderID) {
        var dfd = $q.defer();
        ListAllMeProducts()
            .then(function(productList) {
                var productIds = _.pluck(productList, 'ID');
                ocLineItems.ListAll(originalOrderID)
                    .then(function(lineItemList) {
                        lineItemList.ProductIds = productIds;
                        var valid = [];
                        var invalid = [];
                        angular.forEach(lineItemList, function(li) {
                            productIds.indexOf(li.ProductID) > -1 ? valid.push(li) : invalid.push(li);
                        });
                        dfd.resolve({valid: valid, invalid: invalid});
                    });
            });
        return dfd.promise;

        function ListAllMeProducts() {
            var dfd = $q.defer();
            var queue = [];
            OrderCloud.Me.ListProducts(null, 1, 100)
                .then(function(data) {
                    var productList = data;
                    if (data.Meta.TotalPages > data.Meta.Page) {
                        var page = data.Meta.Page;
                        while (page < data.Meta.TotalPages) {
                            page += 1;
                            queue.push(OrderCloud.Me.ListProducts(null, page, 100));
                        }
                    }
                    $q.all(queue)
                        .then(function(results) {
                            angular.forEach(results, function(result) {
                                productList.Items = [].concat(productList.Items, result.Items);
                            });
                            dfd.resolve(productList.Items);
                        })
                        .catch(function(err) {
                            dfd.reject(err);
                        });
                });
            return dfd.promise;
        }
    }

    function addLineItemsToCart(validLI, orderID) {
        var queue = [];
        var dfd = $q.defer();
        angular.forEach(validLI, function(li){
            var lineItemToAdd = {
                ProductID: li.ProductID,
                Quantity: li.Quantity,
                Specs: li.Specs
            };
            queue.push(OrderCloud.LineItems.Create(orderID, lineItemToAdd));
        });
        $q.all(queue)
            .then(function(){
                dfd.resolve();
                toastr.success('Product(s) Add to Cart', 'Success');
            })
            .catch(function(error){
                $exceptionHandler(error);
                dfd.reject(error);
            });
        return dfd.promise;
    }
}