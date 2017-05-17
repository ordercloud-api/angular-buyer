angular.module('orderCloud')
    .component('ocProductCard', {
        templateUrl: 'common/directives/oc-product-card/oc-product-card.html',
        controller: ocProductCard,
        controllerAs: 'productCard',
        bindings: {
            product: '<',
            currentOrder: '=',
            currentUser: '<',
            lineitemlist: '='
        }
    });

function ocProductCard($rootScope, $scope, $exceptionHandler, $timeout, toastr, OrderCloudSDK){
    var vm = this;

    $scope.$watch(function(){
        return vm.product.Quantity;
    }, function(newVal){
        vm.findPrice(newVal);
    });

    $timeout(setDefaultQuantity, 100);

    vm.addToCart = function(OCProductForm) {
        var li = {
            ProductID: vm.product.ID,
            Quantity: vm.product.Quantity
        };

        return OrderCloudSDK.LineItems.Create('outgoing', vm.currentOrder.ID, li)
            .then(function(lineItem) {
                $rootScope.$broadcast('OC:UpdateOrder', vm.currentOrder.ID, 'Updating Order');
                $rootScope.$broadcast('OC:UpdateTotalQuantity', li, true);
                setDefaultQuantity();
                toastr.success(vm.product.Name + ' was added to cart');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.findPrice = function(qty){
        if(qty){
            var finalPriceBreak = {};
            angular.forEach(vm.product.PriceSchedule.PriceBreaks, function(priceBreak) {
                if (priceBreak.Quantity <= qty)
                finalPriceBreak = angular.copy(priceBreak);
            });
            vm.calculatedPrice = finalPriceBreak.Price * qty;
        }
    };

    function setDefaultQuantity() {
        vm.product.Quantity = (vm.product.PriceSchedule && vm.product.PriceSchedule.MinQuantity)
                     ? vm.product.PriceSchedule.MinQuantity
                     : 1;
    }
}