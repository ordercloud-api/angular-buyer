angular.module('orderCloud')
	.controller('PaymentsCtrl', PaymentsController)
;

//TODO: Refactor for multiple payments without Payments.Patch

function PaymentsController($rootScope, $scope, $filter, $exceptionHandler, toastr, OrderCloudSDK, ocCheckoutPaymentService, CheckoutConfig) {
	if (!$scope.methods) $scope.methods = CheckoutConfig.AvailablePaymentMethods;

	OrderCloudSDK.Payments.List('outgoing', $scope.order.ID)
		.then(function(data) {
			if (!data.Items.length) {
				$scope.payments = {Items: []};
				$scope.addNewPayment(false);
			}
			else if (ocCheckoutPaymentService.PaymentsExceedTotal(data, $scope.order.Total)) {
				ocCheckoutPaymentService.RemoveAllPayments(data, $scope.order)
					.then(function(data) {
						$scope.payments = {Items: []};
						$scope.addNewPayment(false);
					});
			}
			else {
				$scope.payments = data;
				calculateMaxTotal();
			}
		});

	$scope.addNewPayment = function(notify) {
		var paymentTotal = $scope.order.Total - _.reduce($scope.payments.Items, function(sum, payment) { return payment.Amount + sum; }, 0);
		var payment = {
			Type: CheckoutConfig.AvailablePaymentMethods[0],
			DateCreated: new Date().toISOString(),
			CreditCardID: null,
			SpendingAccountID: null,
			Description: null,
			Amount: paymentTotal,
			xp: {}
		};
		$scope.payments.Items.push(payment);
		calculateMaxTotal();
	};

	$scope.removePayment = function(scope) {
		// TODO: when api bug EX-1053 is fixed refactor this to simply delete the payment

		return OrderCloudSDK.Payments.Delete('outgoing', $scope.order.ID, scope.payment.ID)
			.then(function(){
				$scope.payments.Items.splice(scope.$index, 1);
				calculateMaxTotal();
				return toastr.success('Payment removed.');
			});
	};

	$scope.updatePaymentAmount = function(scope) {
		if (scope.payment.Amount > scope.payment.MaxAmount || !scope.payment.Amount) return;
		//TODO: Buyer Users currently cannot patch a payment - we need to refactor for multiple payments
		OrderCloudSDK.Payments.Patch('outgoing', $scope.order.ID, scope.payment.ID, scope.payment)
			.then(function(data) {
				toastr.success('Payment amount updated to ' + $filter('currency')(scope.payment.Amount));
				calculateMaxTotal();
			})
			.catch(function(ex) {
				$exceptionHandler(ex);
			});
	};

	$rootScope.$on('OC:PaymentsUpdated', function() {
		calculateMaxTotal();
	});


	function calculateMaxTotal() {
		var paymentTotal = 0;
		$scope.excludeOptions = {
			SpendingAccounts: [],
			CreditCards: []
		};
		angular.forEach($scope.payments.Items, function(payment) {
			paymentTotal += payment.Amount;
			if (payment.SpendingAccountID) $scope.excludeOptions.SpendingAccounts.push(payment.SpendingAccountID);
			if (payment.CreditCardID) $scope.excludeOptions.CreditCards.push(payment.CreditCardID);
			var maxAmount = $scope.order.Total - _.reduce(_.pluck($scope.payments.Items, 'Amount'), function(a, b) {return a + b; });
			payment.MaxAmount = (payment.Amount + maxAmount).toFixed(2);
		});
		$scope.canAddPayment = paymentTotal < $scope.order.Total;
		if($scope.OCPayments) $scope.OCPayments.$setValidity('Insufficient_Payment', !$scope.canAddPayment);
	}
}