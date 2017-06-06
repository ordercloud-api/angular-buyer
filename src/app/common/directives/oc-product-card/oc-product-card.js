angular.module('orderCloud')
    .component('ocProductCard', {
        templateUrl: 'common/directives/oc-product-card/oc-product-card.html',
        controller: ocProductCard,
        controllerAs: 'productCard',
        bindings: {
            product: '<',
            currentOrder: '<',
            lineitemlist: '<'
        }
    });

function ocProductCard($scope, $exceptionHandler, toastr, OrderCloudSDK){
    var vm = this;
    var toastID = 0; // This is used to circumvent the global toastr config that prevents duplicate toasts from opening.
    
    vm.$onInit = onInit;
    vm.addToCart = addToCart;
    vm.findPrice = findPrice;
    vm.setDefaultQuantity = setDefaultQuantity;

    function onInit() {
        if (!vm.currentOrder) return;
        if (vm.product.PriceSchedule && vm.product.PriceSchedule.PriceBreaks) {
            $scope.$watch(function(){
                return vm.product.Quantity;
            }, function(newVal){
                vm.findPrice(newVal);
            });
        }

        vm.setDefaultQuantity();
    }

    function addToCart() {
        var li = {
            ProductID: vm.product.ID,
            Quantity: vm.product.Quantity
        };

        return OrderCloudSDK.LineItems.Create('outgoing', vm.currentOrder.ID, li)
            .then(function() {
                $scope.$emit('OC:UpdateOrder', vm.currentOrder.ID, {lineItems: li, add: true});
                vm.setDefaultQuantity();
                toastr.success(vm.product.Name + ' was added to your cart. <span class="hidden">' + vm.product.ID + toastID + '</span>', null, {allowHtml:true});
                toastID++;
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
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

    function setDefaultQuantity() {
        vm.product.Quantity = (vm.product.PriceSchedule && vm.product.PriceSchedule.MinQuantity)
                     ? vm.product.PriceSchedule.MinQuantity
                     : 1;
    }
}