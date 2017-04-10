angular.module('orderCloud')
	.controller('PaymentCtrl', PaymentController)
;

function PaymentController($scope, $rootScope, OrderCloudSDK, ocCheckoutPaymentService, CheckoutConfig) {
	if (!$scope.methods) $scope.methods = CheckoutConfig.AvailablePaymentMethods;
	if (!$scope.payment) {
		OrderCloudSDK.Payments.List('outgoing', $scope.order.ID)
			.then(function(data) {
				if (ocCheckoutPaymentService.PaymentsExceedTotal(data, $scope.order.Total)) {
					ocCheckoutPaymentService.RemoveAllPayments(data, $scope.order)
						.then(function(data) {
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
						});
				}
				else if (data.Items.length) {
					$scope.payment = data.Items[0];
					if ($scope.methods.length == 1) $scope.payment.Type = $scope.methods[0];
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
				}
			});
	} else if ($scope.methods.length == 1) {
		$scope.payment.Type = $scope.methods[0];
	}

	$rootScope.$on('OCPaymentUpdated', function(event, payment) {
		$scope.payment = payment;
	});

	$scope.savePayment = function(payment) {
		if (payment.ID) {
			OrderCloudSDK.Payments.Delete('outgoing', $scope.order.ID, payment.ID)
				.then(function() {
					delete payment.ID;
					createPayment(payment);
				});
		} else {
			createPayment(payment);
		}

		function createPayment(newPayment) {
			if (angular.isDefined(newPayment.Accepted)) delete newPayment.Accepted;
			OrderCloudSDK.Payments.Create('outgoing', $scope.order.ID, newPayment)
				.then(function(data) {
					data.Editing = false;
					$scope.OCPayment.$setValidity('ValidPayment', true);
					$scope.payment = data;
				});
		}
	};


	$scope.paymentValid = function(payment) {
		if (!payment || payment.Editing || payment.Amount != $scope.order.Total) return false; //TODO: refactor for multiple payments

		var valid = false;
		
		switch(payment.Type) {
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