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

    $timeout(_initialize, 100);

    var toastID = 0; // This is used to circumvent the global toastr config that prevents duplicate toasts from opening.
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
                toastr.success(vm.product.Name + ' was added to your cart. <span class="hidden">' + vm.product.ID + toastID + '</span>', null, {allowHtml:true});
                toastID++;
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    function _initialize() {
        if (vm.product.PriceSchedule && vm.product.PriceSchedule.PriceBreaks) {
            $scope.$watch(function(){
                return vm.product.Quantity;
            }, function(newVal){
                _findPrice(newVal);
            });
        }

        setDefaultQuantity();
    }

    function _findPrice(qty){
        if(qty){
            var finalPriceBreak = {};
            angular.forEach(vm.product.PriceSchedule.PriceBreaks, function(priceBreak) {
                if (priceBreak.Quantity <= qty)
                finalPriceBreak = angular.copy(priceBreak);
            });
            vm.calculatedPrice = finalPriceBreak.Price * qty;
        }
    }

    function setDefaultQuantity() {
        vm.product.Quantity = (vm.product.PriceSchedule && vm.product.PriceSchedule.MinQuantity)
                     ? vm.product.PriceSchedule.MinQuantity
                     : 1;
    }
}