angular.module('orderCloud')
	.controller('CheckoutReviewCtrl', CheckoutReviewController)
;

function CheckoutReviewController(LineItemsList, OrderPaymentsDetail) {
	var vm = this;
	vm.payments = OrderPaymentsDetail;
	vm.lineItems = LineItemsList;
}