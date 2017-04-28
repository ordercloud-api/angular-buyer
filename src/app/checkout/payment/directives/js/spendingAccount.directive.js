angular.module('orderCloud')
	//Single Spending Account Payment
	.directive('ocPaymentSa', OrderCloudPaymentSpendingAccountDirective)
;

function OrderCloudPaymentSpendingAccountDirective() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			payment: '=?',
			excludedSpendingAccounts: '=?excludeOptions'
		},
		templateUrl: 'checkout/payment/directives/templates/spendingAccount.html',
		controller: 'PaymentSpendingAccountCtrl',
		controllerAs: 'paymentSA'
	}
}