angular.module('orderCloud')
    .controller('ProductDetailCtrl', ProductDetailController)
;

function ProductDetailController($exceptionHandler, Product, CurrentOrder, ocLineItems, toastr) {
    var vm = this;
    vm.item = Product;
    vm.finalPriceBreak = null;

    $("#zoom").ezPlus();
    
    var toastID = 0; // This is used to circumvent the global toastr config that prevents duplicate toats from opening.
    vm.addToCart = function() {
        ocLineItems.AddItem(CurrentOrder, vm.item)
            .then(function() {
                toastr.success(vm.item.Name + ' was added to your cart. <span class="hidden">' + vm.item.ID + toastID + '</span>', null, {allowHtml:true});
                toastID++;
            })
            .catch(function(error){
               $exceptionHandler(error);
            });
    };

    vm.findPrice = function(qty){
        angular.forEach(vm.item.PriceSchedule.PriceBreaks, function(priceBreak) {
            if (priceBreak.Quantity <= qty)
                vm.finalPriceBreak = angular.copy(priceBreak);
        });

        return vm.finalPriceBreak.Price * qty;
    };
}