angular.module('orderCloud')
	//Single Payment, Multiple Types
	.directive('ocPayment', OrderCloudPaymentDirective)
    .controller('PaymentCtrl', PaymentController)
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

function PaymentController($scope, $rootScope, OrderCloudSDK, ocCheckoutPayment, CheckoutConfig) {
	if (!$scope.methods) $scope.methods = CheckoutConfig.AvailablePaymentMethods;
	if (!$scope.payment) {
		OrderCloudSDK.Payments.List('outgoing', $scope.order.ID)
			.then(function (data) {
				if (ocCheckoutPayment.PaymentsExceedTotal(data, $scope.order.Total)) {
					ocCheckoutPayment.RemoveAllPayments(data, $scope.order)
						.then(function (data) {
							var payment = {
								Type: CheckoutConfig.AvailablePaymentMethods[0],
								DateCreated: new Date().toISOString(),
								CreditCardID: null,
								SpendingAccountID: null,
								Description: null,
								Amount: $scope.order.Total,
								xp: {}
							};
							$scope.payment = payment;
							validateBillingAddress();
						});
				} else if (data.Items.length) {
					$scope.payment = data.Items[0];
					if ($scope.methods.length == 1) $scope.payment.Type = $scope.methods[0];
					validateBillingAddress();
				} else {
					var payment = {
						Type: CheckoutConfig.AvailablePaymentMethods[0],
						DateCreated: new Date().toISOString(),
						CreditCardID: null,
						SpendingAccountID: null,
						Description: null,
						Amount: $scope.order.Total,
						xp: {},
						Editing: true
					};
					$scope.payment = payment;
					validateBillingAddress();
				}
			});
	} else if ($scope.methods.length == 1) {
		$scope.payment.Type = $scope.methods[0];
		validateBillingAddress();
	}

	function validateBillingAddress() {
		if ($scope.payment.Type === 'CreditCard') $scope.$parent.checkoutPayment.billingAddressRequired = true;
	}

	$rootScope.$on('OCPaymentUpdated', function (event, payment) {
		$scope.payment = payment;
	});

	$scope.paymentValid = function (payment) {
		if (!payment || payment.Editing || payment.Amount != $scope.order.Total) return false; //TODO: refactor for multiple payments

		var valid = false;

		switch (payment.Type) {
			case 'CreditCard':
				valid = payment.CreditCardID != null;
				break;
			case 'SpendingAccount':
				valid = payment.SpendingAccountID != null;
				break;
			case 'PurchaseOrder':
				valid = true;
				break;
		}

		$scope.OCPayment.$setValidity('ValidPayment', (valid && !payment.Editing));

		return valid;
	};
}