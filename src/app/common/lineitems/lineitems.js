angular.module('ordercloud-lineitems', [])

    .factory('LineItemHelpers', LineItemFactory)
    .controller('LineItemModalCtrl', LineItemModalController)

;

function LineItemFactory($rootScope, $q, $state, $uibModal, Underscore, OrderCloud, CurrentOrder) {
    return {
        SpecConvert: SpecConvert,
        RemoveItem: RemoveItem,
        UpdateQuantity: UpdateQuantity,
        GetProductInfo: GetProductInfo,
        CustomShipping: CustomShipping,
        UpdateShipping: UpdateShipping,
        ListAll: ListAll
    };

    function SpecConvert(specs) {
        var results = [];
        angular.forEach(specs, function (spec) {
            var spec_to_push = {SpecID: spec.ID};
            if (spec.Options.length > 0) {
                if (spec.DefaultOptionID) {
                    spec_to_push.OptionID = spec.DefaultOptionID;
                }
                if (spec.OptionID) {
                    spec_to_push.OptionID = spec.OptionID;
                }
                if (spec.Value) {
                    spec_to_push.Value = spec.Value;
                }
            }
            else {
                spec_to_push.Value = spec.Value || spec.DefaultValue || null;
            }
            results.push(spec_to_push);
        });
        return results;
    }

    function RemoveItem(Order, LineItem) {
        OrderCloud.LineItems.Delete(Order.ID, LineItem.ID)
            .then(function () {
                // If all line items are removed delete the order.
                OrderCloud.LineItems.List(Order.ID)
                    .then(function (data) {
                        if (!data.Items.length) {
                            CurrentOrder.Remove();
                            OrderCloud.Orders.Delete(Order.ID).then(function () {
                                $state.reload();
                                $rootScope.$broadcast('OC:OrderDeleted');
                            });
                        }
                        else {
                            $state.reload();
                        }
                    });
            });
    }

    function UpdateQuantity(Order, LineItem) {
        if (LineItem.Quantity > 0) {
            OrderCloud.LineItems.Patch(Order.ID, LineItem.ID, {Quantity: LineItem.Quantity})
                .then(function () {
                    $rootScope.$broadcast('OC:UpdateOrder', Order.ID);
                });
        }
    }

    function GetProductInfo(LineItems) {
        var li = LineItems.Items || LineItems;
        var productIDs = Underscore.uniq(Underscore.pluck(li, 'ProductID'));
        var dfd = $q.defer();
        var queue = [];
        angular.forEach(productIDs, function (productid) {
            queue.push(OrderCloud.Me.GetProduct(productid));
        });
        $q.all(queue)
            .then(function (results) {
                angular.forEach(li, function (item) {
                    item.Product = angular.copy(Underscore.where(results, {ID: item.ProductID})[0]);
                });
                dfd.resolve(li);
            });
        return dfd.promise;
    }

    function CustomShipping(Order, LineItem) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'common/lineitems/templates/shipping.tpl.html',
            controller: 'LineItemModalCtrl',
            controllerAs: 'liModal',
            size: 'lg'
        });

        modalInstance.result
            .then(function (address) {
                address.ID = Math.floor(Math.random() * 1000000).toString();
                OrderCloud.LineItems.SetShippingAddress(Order.ID, LineItem.ID, address)
                    .then(function () {
                        $rootScope.$broadcast('LineItemAddressUpdated', LineItem.ID, address);
                    });
            });
    }

    function UpdateShipping(Order, LineItem, AddressID) {
        OrderCloud.Addresses.Get(AddressID)
            .then(function (address) {
                OrderCloud.LineItems.SetShippingAddress(Order.ID, LineItem.ID, address);
                $rootScope.$broadcast('LineItemAddressUpdated', LineItem.ID, address);
            });
    }

    function ListAll(orderID) {
        var li;
        var dfd = $q.defer();
        var queue = [];
        OrderCloud.LineItems.List(orderID, 1, 100)
            .then(function (data) {
                li = data;
                if (data.Meta.TotalPages > data.Meta.Page) {
                    var page = data.Meta.Page;
                    while (page < data.Meta.TotalPages) {
                        page += 1;
                        queue.push(OrderCloud.LineItems.List(orderID, page, 100));
                    }
                }
                $q.all(queue)
                    .then(function (results) {
                        angular.forEach(results, function (result) {
                            li.Items = [].concat(li.Items, result.Items);
                            li.Meta = result.Meta;
                        });
                        dfd.resolve(li.Items);
                    });
            });
        return dfd.promise;
    }
}

function LineItemModalController($uibModalInstance) {
    var vm = this;
    vm.address = {};

    vm.submit = function () {
        $uibModalInstance.close(vm.address);
    };

    vm.cancel = function () {
        vm.address = {};
        $uibModalInstance.dismiss('cancel');
    };
}
