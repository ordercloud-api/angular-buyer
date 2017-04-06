angular.module('orderCloud')
	.config(CheckoutConfirmationConfig)
;

function CheckoutConfirmationConfig($stateProvider) {
	$stateProvider
		.state('confirmation', {
			parent: 'base',
			url: '/confirmation/:orderid',
			templateUrl: 'checkout/confirmation/templates/checkout.confirmation.html',
			controller: 'CheckoutConfirmationCtrl',
			controllerAs: 'checkoutConfirmation',
			resolve: {
				SubmittedOrder: function($stateParams, sdkOrderCloud) {
					return sdkOrderCloud.Orders.Get('outgoing', $stateParams.orderid);
				},
				OrderShipAddress: function(SubmittedOrder, sdkOrderCloud){
					return sdkOrderCloud.Me.GetAddress(SubmittedOrder.ShippingAddressID);
				},
				OrderPromotions: function(SubmittedOrder, sdkOrderCloud) {
					return sdkOrderCloud.Orders.ListPromotions('outgoing', SubmittedOrder.ID);
				},
				OrderBillingAddress: function(SubmittedOrder, sdkOrderCloud){
					return sdkOrderCloud.Me.GetAddress(SubmittedOrder.BillingAddressID);
				},
				OrderPayments: function($q, SubmittedOrder, sdkOrderCloud) {
					var deferred = $q.defer();
					sdkOrderCloud.Payments.List('outgoing', SubmittedOrder.ID)
						.then(function(data) {
							var queue = [];
							angular.forEach(data.Items, function(payment, index) {
								if (payment.Type === 'CreditCard' && payment.CreditCardID) {
									queue.push((function() {
										var d = $q.defer();
										sdkOrderCloud.Me.GetCreditCard(payment.CreditCardID)
											.then(function(cc) {
												data.Items[index].Details = cc;
												d.resolve();
											});
										return d.promise;
									})());
								} else if (payment.Type === 'SpendingAccount' && payment.SpendingAccountID) {
									queue.push((function() {
										var d = $q.defer();
										sdkOrderCloud.Me.GetSpendingAccount(payment.SpendingAccountID)
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
				LineItemsList: function($q, $state, toastr, ocLineItems, SubmittedOrder, sdkOrderCloud) {
					var dfd = $q.defer();
					sdkOrderCloud.LineItems.List('outgoing', SubmittedOrder.ID, {pageSize: 100})
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