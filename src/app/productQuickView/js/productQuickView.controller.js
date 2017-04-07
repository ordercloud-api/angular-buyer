angular.module('orderCloud')
	.controller('ProductQuickViewCtrl', ProductQuickViewController)
;

function ProductQuickViewController(toastr, $uibModalInstance, SelectedProduct, CurrentOrder, ocLineItems) {
	var vm = this;
	vm.item = SelectedProduct;
	vm.addToCart = function() {
		ocLineItems.AddItem(CurrentOrder, vm.item)
			.then(function(){
                toastr.success('Product successfully added to your cart.');
				$uibModalInstance.close();
			});
	};

	vm.findPrice = function(qty){
		var finalPriceBreak = null;
		angular.forEach(vm.item.PriceSchedule.PriceBreaks, function(priceBreak) {
			if (priceBreak.Quantity <= qty)
				finalPriceBreak = angular.copy(priceBreak);
		});

		return finalPriceBreak.Price * qty;
	};

	vm.cancel = function() {
		$uibModalInstance.dismiss();
	};
}