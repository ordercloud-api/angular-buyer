angular.module('orderCloud')
	.config(checkoutPaymentConfig)
;

function checkoutPaymentConfig($stateProvider) {
	$stateProvider
		.state('checkout.payment', {
			url: '/payment',
			templateUrl: 'checkout/payment/templates/checkout.payment.html',
			controller: 'CheckoutPaymentCtrl',
			controllerAs: 'checkoutPayment'
		})
    ;
}