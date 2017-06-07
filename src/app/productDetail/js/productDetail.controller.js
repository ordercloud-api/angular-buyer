angular.module('orderCloud')
    .controller('ProductDetailCtrl', ProductDetailController)
;

function ProductDetailController($exceptionHandler, $scope, Product, RelatedProducts, CurrentOrder, ocLineItems, toastr, productImagesModal) {
    var vm = this;
    vm.item = Product;
    vm.finalPriceBreak = null;
    vm.relatedProducts = RelatedProducts;

    vm.addToCart = addToCart;
    vm.findPrice = findPrice;
    vm.openImageModal = openImageModal;
    
    var toastID = 0; // This is used to circumvent the global toastr config that prevents duplicate toastrs from opening.
    function addToCart() {
        ocLineItems.AddItem(CurrentOrder, vm.item)
            .then(function() {
                toastr.success(vm.item.Name + ' was added to your cart. <span class="hidden">' + vm.item.ID + toastID + '</span>', null, {allowHtml:true});
                toastID++;
            })
            .catch(function(error){
               $exceptionHandler(error);
            });
    };

    function findPrice(qty){
        angular.forEach(vm.item.PriceSchedule.PriceBreaks, function(priceBreak) {
            if (priceBreak.Quantity <= qty)
                vm.finalPriceBreak = angular.copy(priceBreak);
        });

        return vm.finalPriceBreak.Price * qty;
    };

    function openImageModal(index) {
        productImagesModal.Open(vm.item, index);
    }
}