angular.module('orderCloud')
	//Single Credit Card Payment
	.directive('ocPaymentCc', OrderCloudPaymentCreditCardDirective)
    .controller('PaymentCreditCardCtrl', PaymentCreditCardController)
;

function OrderCloudPaymentCreditCardDirective() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			payment: '=?',
			excludedCreditCards: '=?excludeOptions'
		},
		templateUrl: 'checkout/payment/directives/oc-payment-cc/oc-payment-cc.html',
		controller: 'PaymentCreditCardCtrl',
		controllerAs: 'paymentCC'
	};
}

function PaymentCreditCardController($scope, $rootScope, $filter, $exceptionHandler, toastr, CheckoutConfig, OrderCloudSDK, ocMyCreditCards, ocCheckoutPayment) {
	var creditCardListOptions = {
		page: 1,
		pageSize: 100
	};
	OrderCloudSDK.Me.ListCreditCards(creditCardListOptions)
		.then(function(data) {
			$scope.creditCards = data.Items;
		});

	if (!$scope.payment) {
		OrderCloudSDK.Payments.List('outgoing', $scope.order.ID)
			.then(function(data) {
				if (data.Items.length) {
					$scope.payment = data.Items[0];
					$scope.showPaymentOptions = false;
				} else {
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
				}
				getCreditCards();
			});
	} else {
		delete $scope.payment.SpendingAccountID;
		if ($scope.payment.xp && $scope.payment.xp.PONumber) $scope.payment.xp.PONumber = null;
		getCreditCards();
	}

	function getCreditCards() {
		var creditCardListOptions = {
			page: 1,
			pageSize: 100
		};
		OrderCloudSDK.Me.ListCreditCards(creditCardListOptions)
			.then(function(data) {
				$scope.creditCards = data.Items;
				if ($scope.payment.CreditCardID) {
					$scope.payment.CreditCard = _.findWhere($scope.creditCards, {ID: $scope.payment.CreditCardID});
				} else {
					$scope.showPaymentOptions = true;
				}
			});
	}

	$scope.changePaymentAccount = function() {
		ocCheckoutPayment.SelectPaymentAccount($scope.payment, $scope.order)
			.then(function(payment) {
				$scope.payment = payment;
				$scope.OCPaymentCreditCard.$setValidity('CreditCardNotSet', true);
			})
			.catch(function(ex) {
				if (ex === 'CREATE_NEW_CC') {
					ocMyCreditCards.Create()
						.then(function(card) {
							toastr.success('Credit card ending in ' + card.PartialAccountNumber + ' was saved.');
							$scope.creditCards.push(card);
							$scope.payment.CreditCardID = card.ID;
							ocCheckoutPayment.Save($scope.payment, $scope.order, card);
						});
				}
			});
	};

	$rootScope.$on('OCPayment:CreditCardCreated', function(event, card) {
		$scope.creditCards.push(card);
	});

	$scope.$watch('payment', function(n) {
		if (n && !n.CreditCardID) {
			$scope.OCPaymentCreditCard.$setValidity('CreditCardNotSet', false);
		} else {
			$scope.OCPaymentCreditCard.$setValidity('CreditCardNotSet', true);
		}

		if (n.CreditCardID) n.CreditCard = _.findWhere($scope.creditCards, {ID: $scope.payment.CreditCardID});
		$scope.showPaymentOptions = n.Editing;
		if (n.SpendingAccountID) delete n.SpendingAccountID;
		if (n.xp && n.xp.PONumber) delete n.xp.PONumber;
	}, true);
}