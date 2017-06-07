angular.module('orderCloud')
    .controller('ProductCardCtrl', OrderCloudProductCardController)
    .directive('ocProductCard', function() {
        return {
            templateUrl: 'common/directives/oc-product-card/oc-product-card.html',
            controller: 'ProductCardCtrl',
            controllerAs: 'productCard',
            replace: true,
            bindToController: true,
            scope: {
                product: '<',
                currentOrder: '<',
                lineitemlist: '<'
            }
        };
    });

function OrderCloudProductCardController($scope, $exceptionHandler, toastr, ocLineItems){
    var vm = this;
    var toastID = 0; // This is used to circumvent the global toastr config that prevents duplicate toasts from opening.
    
    vm.$onInit = onInit;
    vm.addToCart = addToCart;
    vm.findPrice = findPrice;

    function onInit() {
        if (!vm.currentOrder) return;
        if (vm.product.PriceSchedule && vm.product.PriceSchedule.PriceBreaks) {
            $scope.$watch(function(){
                return vm.product.Quantity;
            }, function(newVal){
                vm.findPrice(newVal);
            });
        }
    }

    function addToCart() {
        return ocLineItems.AddItem(vm.currentOrder, vm.product)
            .then(function() {
                toastr.success(vm.product.Name + ' was added to your cart. <span class="hidden">' + vm.product.ID + toastID + '</span>', null, {allowHtml:true});
                toastID++;
            })
            .catch(function(error){
               $exceptionHandler(error);
            });
    }

    function findPrice(qty){
        if(qty){
            var finalPriceBreak = {};
            _.each(vm.product.PriceSchedule.PriceBreaks, function(priceBreak) {
                if (priceBreak.Quantity <= qty)
                finalPriceBreak = angular.copy(priceBreak);
            });
            vm.calculatedPrice = finalPriceBreak.Price * qty;
        }
    }
}