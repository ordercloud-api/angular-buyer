angular.module('orderCloud')
	.controller('PaymentSpendingAccountCtrl', PaymentSpendingAccountController)
;

function PaymentSpendingAccountController($scope, $rootScope, $exceptionHandler, toastr, sdkOrderCloud) {
	var spendingAccountListOptions = {
		page: 1,
		pageSize: 100,
		filters: {RedemptionCode: '!*', AllowAsPaymentMethod: true}
	};
	sdkOrderCloud.Me.ListSpendingAccounts(spendingAccountListOptions)
		.then(function(data) {
			$scope.spendingAccounts = data.Items;
		});

	if (!$scope.payment) {
		sdkOrderCloud.Payments.List('outgoing', $scope.order.ID)
			.then(function(data) {
				if (data.Items.length) {
					//TODO: Buyer Users currently cannot patch a payment - we may need to refactor
					sdkOrderCloud.Payments.Patch('outgoing', $scope.order.ID, data.Items[0].ID, {
						Type: 'SpendingAccount',
						xp: {
							PONumber:null
						},
						CreditCardID:null,
						SpendingAccountID:null,
						Amount:null
					}).then(function(data) {
						$scope.payment = data;
						if (!$scope.payment.SpendingAccountID) $scope.showPaymentOptions = true;
					});
				} else {
					sdkOrderCloud.Payments.Create('outgoing', $scope.order.ID, {Type: 'SpendingAccount'})
						.then(function(data) {
							$scope.payment = data;
							$scope.showPaymentOptions = true;
						});
				}
			});
	} else {
		delete $scope.payment.CreditCardID;
		if ($scope.payment.xp && $scope.payment.xp.PONumber) $scope.payment.xp.PONumber = null;
		if (!$scope.payment.SpendingAccountID) $scope.showPaymentOptions = true;
	}

	$scope.changePayment = function() {
		$scope.showPaymentOptions = true;
	};

	$scope.updatePayment = function(scope) {
		var oldSelection = angular.copy($scope.payment.SpendingAccountID);
		$scope.payment.SpendingAccountID = scope.spendingAccount.ID;
		//TODO: Buyer Users currently cannot patch a payment - we may need to refactor
		$scope.updatingSpendingAccountPayment = sdkOrderCloud.Payments.Patch('outgoing', $scope.order.ID, $scope.payment.ID, $scope.payment)
			.then(function() {
				$scope.showPaymentOptions = false;
				toastr.success('Using ' + scope.spendingAccount.Name,'Spending Account Payment');
				$rootScope.$broadcast('OC:PaymentsUpdated');
			})
			.catch(function(ex) {
				$scope.payment.SpendingAccountID = oldSelection;
				$exceptionHandler(ex);
			});
	};

	$scope.$watch('payment', function(n,o) {
		if (n && !n.SpendingAccountID) {
			$scope.OCPaymentSpendingAccount.$setValidity('SpendingAccount_Not_Set', false);
		} else {
			$scope.OCPaymentSpendingAccount.$setValidity('SpendingAccount_Not_Set', true);
		}
	}, true);
}