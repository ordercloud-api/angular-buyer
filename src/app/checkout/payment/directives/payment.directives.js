angular.module('orderCloud')

	//Single Purchase Order Payment
	.directive('ocPaymentPo', OCPaymentPurchaseOrder)
	.controller('PaymentPurchaseOrderCtrl', PaymentPurchaseOrderController)

	//Single Spending Account Payment
	.directive('ocPaymentSa', OCPaymentSpendingAccount)
	.controller('PaymentSpendingAccountCtrl', PaymentSpendingAccountController)

	//Single Credit Card Payment
	.directive('ocPaymentCc', OCPaymentCreditCard)
	.controller('PaymentCreditCardCtrl', PaymentCreditCardController)

	//Single Payment, Multiple Types
	.directive('ocPayment', OCPayment)
	.controller('PaymentCtrl', PaymentController)

	//Multiple Payment, Multiple Types
	.directive('ocPayments', OCPayments)
	.controller('PaymentsCtrl', PaymentsController)
;


function OCPaymentPurchaseOrder() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			payment: '=?'
		},
		templateUrl: 'checkout/payment/directives/templates/purchaseOrder.tpl.html',
		controller: 'PaymentPurchaseOrderCtrl'
	}
}

function PaymentPurchaseOrderController($scope, $rootScope, toastr, OrderCloud, $exceptionHandler) {
	if (!$scope.payment) {
		OrderCloud.Payments.List($scope.order.ID)
			.then(function(data) {
				if (data.Items.length) {
					OrderCloud.Payments.Patch($scope.order.ID, data.Items[0].ID, {
						Type: 'PurchaseOrder',
						CreditCardID: null,
						SpendingAccountID: null,
						Amount: null
					}).then(function(data) {
						$scope.payment = data;
					});
				} else {
					OrderCloud.Payments.Create($scope.order.ID, {Type: 'PurchaseOrder'})
						.then(function(data) {
							$scope.payment = data;
						});
				}
			});
	} else if (!($scope.payment.Type == "PurchaseOrder" && $scope.payment.CreditCardID == null && $scope.payment.SpendingAccountID == null)) {
		$scope.payment.Type = "PurchaseOrder";
		$scope.payment.CreditCardID = null;
		$scope.payment.SpendingAccountID = null;
		OrderCloud.Payments.Patch($scope.order.ID, $scope.payment.ID, $scope.payment).then(function() {
			toastr.success('Paying by purchase order', 'Purchase Order Payment');
			$rootScope.$broadcast('OC:PaymentsUpdated');
		});
	}

	$scope.updatePayment = function() {
		if ($scope.payment.xp && $scope.payment.xp.PONumber && (!$scope.payment.xp.PONumber.length)) $scope.payment.xp.PONumber = null;
		OrderCloud.Payments.Update($scope.order.ID, $scope.payment.ID, $scope.payment)
			.then(function() {
				toastr.success('Purchase Order Number Saved');
				$rootScope.$broadcast('OC:PaymentsUpdated');
			})
			.catch(function(ex) {
				$exceptionHandler(ex);
			});
	}
}

function OCPaymentSpendingAccount() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			payment: '=?',
			excludedSpendingAccounts: '=?excludeOptions'
		},
		templateUrl: 'checkout/payment/directives/templates/spendingAccount.tpl.html',
		controller: 'PaymentSpendingAccountCtrl',
		controllerAs: 'paymentSA'
	}
}

function PaymentSpendingAccountController($scope, $rootScope, toastr, OrderCloud, $exceptionHandler) {
	OrderCloud.Me.ListSpendingAccounts(null, 1, 100, null, null, {RedemptionCode: '!*', AllowAsPaymentMethod: true})
		.then(function(data) {
			$scope.spendingAccounts = data.Items;
		});

	if (!$scope.payment) {
		OrderCloud.Payments.List($scope.order.ID)
			.then(function(data) {
				if (data.Items.length) {
					OrderCloud.Payments.Patch($scope.order.ID, data.Items[0].ID, {
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
					OrderCloud.Payments.Create($scope.order.ID, {Type: 'SpendingAccount'})
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

		$scope.updatingSpendingAccountPayment = {
			templateUrl: 'common/loading-indicators/templates/view.loading.tpl.html',
			message:null
		};
		$scope.updatingSpendingAccountPayment.promise = OrderCloud.Payments.Update($scope.order.ID, $scope.payment.ID, $scope.payment)
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

function OCPaymentCreditCard() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			payment: '=?',
			excludedCreditCards: '=?excludeOptions'
		},
		templateUrl: 'checkout/payment/directives/templates/creditCard.tpl.html',
		controller: 'PaymentCreditCardCtrl',
		controllerAs: 'paymentCC'
	}
}

function PaymentCreditCardController($scope, $rootScope, toastr, $filter, OrderCloud, MyPaymentCreditCardModal, $exceptionHandler) {
	OrderCloud.Me.ListCreditCards(null, 1, 100, null, null, {})
		.then(function(data) {
			$scope.creditCards = data.Items;
		});

	if (!$scope.payment) {
		OrderCloud.Payments.List($scope.order.ID)
			.then(function(data) {
				if (data.Items.length) {
					OrderCloud.Payments.Patch($scope.order.ID, data.Items[0].ID, {
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
					OrderCloud.Payments.Create($scope.order.ID, {Type: 'CreditCard'})
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
		$scope.updatingCreditCardPayment = {
			templateUrl: 'common/loading-indicators/templates/view.loading.tpl.html',
			message:null
		};
		$scope.updatingCreditCardPayment.promise = OrderCloud.Payments.Update($scope.order.ID, $scope.payment.ID, $scope.payment)
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
		MyPaymentCreditCardModal.Create()
			.then(function(card) {
				toastr.success('Credit Card Created', 'Success');
				$scope.creditCards.push(card);
				$scope.updatePayment({creditCard:card});
			});
	};
}

function OCPayment() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			methods: '=?',
			payment: '=?',
			paymentIndex: '=?',
			excludeOptions: '=?'
		},
		templateUrl: 'checkout/payment/directives/templates/payment.tpl.html',
		controller: 'PaymentCtrl',
		controllerAs: 'ocPayment'
	}
}

function PaymentController($scope, $rootScope, OrderCloud, CheckoutConfig) {
	if (!$scope.methods) $scope.methods = CheckoutConfig.AvailablePaymentMethods;
	if (!$scope.payment) {
		OrderCloud.Payments.List($scope.order.ID)
			.then(function(data) {
				if (CheckoutPaymentService.PaymentsExceedTotal(data, $scope.order.Total)) {
					CheckoutPaymentService.RemoveAllPayments(data, $scope.order)
						.then(function(data) {
							OrderCloud.Payments.Create($scope.order.ID, {Type: CheckoutConfig.AvailablePaymentMethods[0]})
								.then(function(data) {
									$scope.payment = data;
									$rootScope.$broadcast('OC:PaymentsUpdated');
								});
						});
				}
				else if (data.Items.length) {
					$scope.payment = data.Items[0];
					if ($scope.methods.length == 1) $scope.payment.Type = $scope.methods[0];
				} else {
					OrderCloud.Payments.Create($scope.order.ID, {Type: CheckoutConfig.AvailablePaymentMethods[0]})
						.then(function(data) {
							$scope.payment = data;
							$rootScope.$broadcast('OC:PaymentsUpdated');
						});
				}
			});
	} else if ($scope.methods.length == 1) {
		$scope.payment.Type = $scope.methods[0];
	}
}

function OCPayments() {
	return {
		restrict:'E',
		scope: {
			order: '=',
			methods: '=?'
		},
		templateUrl: 'checkout/payment/directives/templates/payments.tpl.html',
		controller: 'PaymentsCtrl'
	}
}

function PaymentsController($rootScope, $scope, $exceptionHandler, toastr, OrderCloud, CheckoutPaymentService, CheckoutConfig) {
	if (!$scope.methods) $scope.methods = CheckoutConfig.AvailablePaymentMethods;

	OrderCloud.Payments.List($scope.order.ID)
		.then(function(data) {
			if (!data.Items.length) {
				$scope.payments = {Items: []};
				$scope.addNewPayment();
			}
			else if (CheckoutPaymentService.PaymentsExceedTotal(data, $scope.order.Total)) {
				CheckoutPaymentService.RemoveAllPayments(data, $scope.order)
					.then(function(data) {
						$scope.payments = {Items: []};
						$scope.addNewPayment();
					});
			}
			else {
				$scope.payments = data;
				calculateMaxTotal();
			}
		});

	$scope.addNewPayment = function() {
		OrderCloud.Payments.Create($scope.order.ID, {Type: CheckoutConfig.AvailablePaymentMethods[0]})
			.then(function(data) {
				$scope.payments.Items.push(data);
				calculateMaxTotal();
				toastr.success('Payment Added');
			});
	};

	$scope.removePayment = function(scope) {
		OrderCloud.Payments.Delete($scope.order.ID, scope.payment.ID)
			.then(function() {
				$scope.payments.Items.splice(scope.$index, 1);
				calculateMaxTotal();
				toastr.success('Payment Removed');
			});
	};

	$scope.updatePaymentAmount = function(scope) {
		if (scope.payment.Amount > scope.payment.MaxAmount || !scope.payment.Amount) return;
		OrderCloud.Payments.Update($scope.order.ID, scope.payment.ID, scope.payment)
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