angular.module('orderCloud')
	//Single Credit Card Payment
	.directive('ocPaymentCc', OrderCloudPaymentCreditCardDirective)
;

function OrderCloudPaymentCreditCardDirective() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			payment: '=?',
			excludedCreditCards: '=?excludeOptions'
		},
		templateUrl: 'checkout/payment/directives/templates/creditCard.html',
		controller: 'PaymentCreditCardCtrl',
		controllerAs: 'paymentCC'
	}
}