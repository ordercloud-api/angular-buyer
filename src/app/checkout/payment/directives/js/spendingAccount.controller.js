angular.module('orderCloud')
	.controller('PaymentSpendingAccountCtrl', PaymentSpendingAccountController)
;

function PaymentSpendingAccountController($scope, $rootScope, $exceptionHandler, toastr, OrderCloudSDK, ocCheckoutPaymentService) {
	if (!$scope.payment) {
		OrderCloudSDK.Payments.List('outgoing', $scope.order.ID)
			.then(function(data) {
				if (data.Items.length) {
					$scope.payment = data.Items[0];
					$scope.showPaymentOptions = false;
					getSpendingAccounts();
				} else {
					var payment = {
						Type: 'SpendingAccount',
						DateCreated: new Date().toISOString(),
						CreditCardID: null,
						SpendingAccountID: null,
						Description: null,
						Amount: $scope.order.Total,
						xp: {}
					};
					$scope.payment = payment;
					getSpendingAccounts();
				}
			});
	} else {
		delete $scope.payment.CreditCardID;
		if ($scope.payment.xp && $scope.payment.xp.PONumber) $scope.payment.xp.PONumber = null;
		getSpendingAccounts();
	}

	function getSpendingAccounts() {
		var spendingAccountListOptions = {
			page: 1,
			pageSize: 100,
			filters: {RedemptionCode: '!*', AllowAsPaymentMethod: true}
		};
		OrderCloudSDK.Me.ListSpendingAccounts(spendingAccountListOptions)
			.then(function(data) {
				$scope.spendingAccounts = data.Items;
				if ($scope.payment.SpendingAccountID) {
					$scope.payment.SpendingAccount = _.findWhere($scope.spendingAccounts, {ID: $scope.payment.SpendingAccountID});
				} else {
					$scope.showPaymentOptions = true;
				}
			});
	}

	$scope.changePaymentAccount = function() {
		ocCheckoutPaymentService.SelectPaymentAccount($scope.payment, $scope.order)
			.then(function(payment) {
				$scope.payment = payment;
				$scope.OCPaymentSpendingAccount.$setValidity('SpendingAccountNotSet', true);
				$rootScope.$broadcast('OCPaymentUpdated', payment);
			});
	};

	$scope.$watch('payment', function(n, o) {
		if (n && !n.SpendingAccountID || n.Editing) {
			$scope.OCPaymentSpendingAccount.$setValidity('SpendingAccountNotSet', false);
		} else {
			$scope.OCPaymentSpendingAccount.$setValidity('SpendingAccountNotSet', true);
		}

		if (n.SpendingAccountID) n.SpendingAccount = _.findWhere($scope.spendingAccounts, {ID: $scope.payment.SpendingAccountID});
		$scope.showPaymentOptions = n.Editing;
		if (n.CreditCardID) delete n.CreditCardID;
		if (n.xp && n.xp.PONumber) delete n.xp.PONumber;
	}, true);
}