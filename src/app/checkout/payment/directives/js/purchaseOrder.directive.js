angular.module('orderCloud')
	//Single Purchase Order Payment
	.directive('ocPaymentPo', OrderCloudPaymentPurchaseOrderDirective)
;

function OrderCloudPaymentPurchaseOrderDirective() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			payment: '=?'
		},
		templateUrl: 'checkout/payment/directives/templates/purchaseOrder.html',
		controller: 'PaymentPurchaseOrderCtrl'
	}
}