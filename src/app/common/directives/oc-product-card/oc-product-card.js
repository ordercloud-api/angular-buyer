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

function ocProductCard($scope, $exceptionHandler, toastr, ocLineItems){
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
        return ocLineItems.AddItem(vm.currentOrder, vm.product)
            .then(function() {
                vm.setDefaultQuantity();
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

    function setDefaultQuantity() {
        vm.product.Quantity = (vm.product.PriceSchedule && vm.product.PriceSchedule.MinQuantity)
                     ? vm.product.PriceSchedule.MinQuantity
                     : 1;
    }
}