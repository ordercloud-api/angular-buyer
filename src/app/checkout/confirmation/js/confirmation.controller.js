angular.module('orderCloud')
	.controller('CheckoutConfirmationCtrl', CheckoutConfirmationController)
;

function CheckoutConfirmationController(SubmittedOrder, OrderShipAddress, OrderPromotions, OrderBillingAddress, OrderPayments, LineItemsList) {
	var vm = this;
	vm.order = SubmittedOrder;
	vm.shippingAddress = OrderShipAddress;
	vm.promotions = OrderPromotions.Items;
	vm.billingAddress = OrderBillingAddress;
	vm.payments = OrderPayments.Items;
	vm.lineItems = LineItemsList;
}