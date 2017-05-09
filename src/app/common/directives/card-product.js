angular.module('orderCloud')
    .component('ocProductCard', {
        templateUrl: 'common/templates/card.product.html',
        controller: ocProductCard,
        controllerAs: 'productCard',
        bindings: {
            product: '<',
            currentOrder: '=',
            currentUser: '<',
            lineitemlist: '='
        }
    });

function ocProductCard($rootScope, $scope, $exceptionHandler, toastr, OrderCloudSDK){
    var vm = this;

    $scope.$watch(function(){
        return vm.product.Quantity;
    }, function(newVal){
        vm.findPrice(newVal);
    });

    vm.addToCart = function(OCProductForm) {
        var li = {
            ProductID: vm.product.ID,
            Quantity: vm.product.Quantity
        };

        return OrderCloudSDK.LineItems.Create('outgoing', vm.currentOrder.ID, li)
            .then(function(lineItem) {
                $rootScope.$broadcast('OC:UpdateOrder', vm.currentOrder.ID, 'Updating Order');
                vm.product.Quantity = 1;
                toastr.success('Product added to cart', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            })

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
}