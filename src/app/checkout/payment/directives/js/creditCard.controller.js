angular.module('orderCloud')
	.controller('PaymentCreditCardCtrl', PaymentCreditCardController)
;

function PaymentCreditCardController($scope, $rootScope, $filter, $exceptionHandler, toastr, sdkOrderCloud, ocMyCreditCards) {
	var creditCardListOptions = {
		page: 1,
		pageSize: 100
	};
	sdkOrderCloud.Me.ListCreditCards(creditCardListOptions)
		.then(function(data) {
			$scope.creditCards = data.Items;
		});

	if (!$scope.payment) {
		sdkOrderCloud.Payments.List('outgoing', $scope.order.ID)
			.then(function(data) {
				if (data.Items.length) {
					//TODO: Buyer Users currently cannot patch a payment - we may need to refactor
					sdkOrderCloud.Payments.Patch('outgoing', $scope.order.ID, data.Items[0].ID, {
						Type: 'CreditCard',
						xp: {
							PONumber: null
						},
						SpendingAccountID: null,
						Amount: null
					}).then(function(data) {
						$scope.payment = data;
						if (!$scope.payment.SpendingAccountID) $scope.showPaymentOptions = true;
					});
				} else {
					sdkOrderCloud.Payments.Create('outgoing', $scope.order.ID, {Type: 'CreditCard'})
						.then(function(data) {
							$scope.payment = data;
							$scope.showPaymentOptions = true;
						});
				}
			});
	} else {
		delete $scope.payment.SpendingAccountID;
		if ($scope.payment.xp && $scope.payment.xp.PONumber) $scope.payment.xp.PONumber = null;
		if (!$scope.payment.CreditCardID) $scope.showPaymentOptions = true;
	}

	$scope.changePayment = function() {
		$scope.showPaymentOptions = true;
	};

	$scope.$watch('payment', function(n,o) {
		if (n && !n.CreditCardID) {
			$scope.OCPaymentCreditCard.$setValidity('CreditCard_Not_Set', false);
		} else {
			$scope.OCPaymentCreditCard.$setValidity('CreditCard_Not_Set', true);

		}
	}, true);

	$scope.updatePayment = function(scope) {
		var oldSelection = angular.copy($scope.payment.CreditCardID);
		$scope.payment.CreditCardID = scope.creditCard.ID;
		//TODO: Buyer Users currently cannot patch a payment - we may need to refactor
		$scope.updatingCreditCardPayment = sdkOrderCloud.Payments.Patch('outgoing', $scope.order.ID, $scope.payment.ID, $scope.payment)
			.then(function() {
				$scope.showPaymentOptions = false;
				toastr.success('Using ' + $filter('humanize')(scope.creditCard.CardType) + ' ending in ' + scope.creditCard.PartialAccountNumber,'Credit Card Payment');
				$rootScope.$broadcast('OC:PaymentsUpdated');
			})
			.catch(function(ex) {
				$scope.payment.CreditCardID = oldSelection;
				$exceptionHandler(ex);
			});
	};

	$scope.createCreditCard = function() {
		ocMyCreditCards.Create()
			.then(function(card) {
				toastr.success('Credit Card Created', 'Success');
				$scope.creditCards.push(card);
				$scope.updatePayment({creditCard:card});
			});
	};
}