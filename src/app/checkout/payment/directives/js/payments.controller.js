angular.module('orderCloud')
	.controller('PaymentsCtrl', PaymentsController)
;

function PaymentsController($rootScope, $scope, $exceptionHandler, toastr, sdkOrderCloud, ocCheckoutPaymentService, CheckoutConfig) {
	if (!$scope.methods) $scope.methods = CheckoutConfig.AvailablePaymentMethods;

	sdkOrderCloud.Payments.List('outgoing', $scope.order.ID)
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
		sdkOrderCloud.Payments.Create('outgoing', $scope.order.ID, {Type: CheckoutConfig.AvailablePaymentMethods[0]})
			.then(function(data) {
				$scope.payments.Items.push(data);
				calculateMaxTotal();
				if (notify) toastr.success('Payment Added');
			});
	};

	$scope.removePayment = function(scope) {
		// TODO: when api bug EX-1053 is fixed refactor this to simply delete the payment
		//TODO: Buyer Users currently cannot patch a payment - we may need to refactor
		return sdkOrderCloud.Payments.Patch('outgoing', $scope.order.ID, scope.payment.ID, {Type: 'PurchaseOrder', SpendingAccountID: null})
			.then(function() {
				return sdkOrderCloud.Payments.Delete('outgoing', $scope.order.ID, scope.payment.ID)
					.then(function(){
						$scope.payments.Items.splice(scope.$index, 1);
						calculateMaxTotal();
						return toastr.success('Payment Removed');
					});
			});
	};

	$scope.updatePaymentAmount = function(scope) {
		if (scope.payment.Amount > scope.payment.MaxAmount || !scope.payment.Amount) return;
		//TODO: Buyer Users currently cannot patch a payment - we may need to refactor
		sdkOrderCloud.Payments.Patch('outgoing', $scope.order.ID, scope.payment.ID, scope.payment)
			.then(function(data) {
				toastr.success('Payment Amount Updated');
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