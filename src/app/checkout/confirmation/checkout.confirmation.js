angular.module('orderCloud')
	.config(checkoutConfirmationConfig)
	.controller('CheckoutConfirmationCtrl', CheckoutConfirmationController);

function checkoutConfirmationConfig($stateProvider) {
	$stateProvider
		.state('confirmation', {
			parent: 'base',
			url: '/confirmation/:orderid',
			templateUrl: 'checkout/confirmation/templates/checkout.confirmation.html',
			controller: 'CheckoutConfirmationCtrl',
			controllerAs: 'checkoutConfirmation',
			resolve: {
				SubmittedOrder: function($stateParams, OrderCloud) {
					return OrderCloud.Me.GetOrder($stateParams.orderid);
				},
				OrderShipAddress: function(SubmittedOrder, OrderCloud){
					return OrderCloud.Me.GetAddress(SubmittedOrder.ShippingAddressID);
				},
				OrderPromotions: function(SubmittedOrder, OrderCloud) {
					return OrderCloud.Orders.ListPromotions(SubmittedOrder.ID);
				},
				OrderBillingAddress: function(SubmittedOrder, OrderCloud){
					return OrderCloud.Me.GetAddress(SubmittedOrder.BillingAddressID);
				},
				OrderPayments: function($q, SubmittedOrder, OrderCloud) {
					var deferred = $q.defer();
					OrderCloud.Payments.List(SubmittedOrder.ID)
						.then(function(data) {
							var queue = [];
							angular.forEach(data.Items, function(payment, index) {
								if (payment.Type === 'CreditCard' && payment.CreditCardID) {
									queue.push((function() {
										var d = $q.defer();
										OrderCloud.Me.GetCreditCard(payment.CreditCardID)
											.then(function(cc) {
												data.Items[index].Details = cc;
												d.resolve();
											});
										return d.promise;
									})());
								} else if (payment.Type === 'SpendingAccount' && payment.SpendingAccountID) {
									queue.push((function() {
										var d = $q.defer();
										OrderCloud.Me.GetSpendingAccount(payment.SpendingAccountID)
											.then(function(cc) {
												data.Items[index].Details = cc;
												d.resolve();
											});
										return d.promise;
									})());
								}
							});
							$q.all(queue)
								.then(function() {
									deferred.resolve(data);
								})
						});

					return deferred.promise;
				},
				LineItemsList: function($q, $state, toastr, ocLineItems, SubmittedOrder, OrderCloud) {
					var dfd = $q.defer();
					OrderCloud.LineItems.List(SubmittedOrder.ID)
						.then(function(data) {
							ocLineItems.GetProductInfo(data.Items)
								.then(function() {
									dfd.resolve(data);
								});
						});
					return dfd.promise;
				}
			}
		});
}

function CheckoutConfirmationController(SubmittedOrder, OrderShipAddress, OrderPromotions, OrderBillingAddress, OrderPayments, LineItemsList) {
	var vm = this;
	vm.order = SubmittedOrder;
	vm.shippingAddress = OrderShipAddress;
	vm.promotions = OrderPromotions.Items;
	vm.billingAddress = OrderBillingAddress;
	vm.payments = OrderPayments.Items;
	vm.lineItems = LineItemsList;
}