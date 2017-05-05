angular.module('orderCloud')
    .controller('ProductDetailCtrl', ProductDetailController)
;

function ProductDetailController($exceptionHandler, Product, CurrentOrder, ocLineItems, toastr) {
    var vm = this;
    vm.item = Product;
    vm.finalPriceBreak = null;

    vm.addToCart = function() {
        ocLineItems.AddItem(CurrentOrder, vm.item)
            .then(function(){
                toastr.success('Product successfully added to your cart.');
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