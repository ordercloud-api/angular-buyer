angular.module('orderCloud')
	//Single Payment, Multiple Types
	.directive('ocPayment', OrderCloudPaymentDirective)
;

function OrderCloudPaymentDirective() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			methods: '=?',
			payment: '=?',
			paymentIndex: '=?',
			excludeOptions: '=?'
		},
		templateUrl: 'checkout/payment/directives/templates/payment.html',
		controller: 'PaymentCtrl',
		controllerAs: 'ocPayment'
	}
}