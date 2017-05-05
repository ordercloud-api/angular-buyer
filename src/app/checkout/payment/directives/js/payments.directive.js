angular.module('orderCloud')
	//Multiple Payment, Multiple Types
	.directive('ocPayments', OrderCloudPaymentsDirective)
;

function OrderCloudPaymentsDirective() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			methods: '=?'
		},
		templateUrl: 'checkout/payment/directives/templates/payments.html',
		controller: 'PaymentsCtrl'
	}
}