angular.module('orderCloud')
	.config(CheckoutReviewConfig)
;

function CheckoutReviewConfig($stateProvider) {
	$stateProvider
		.state('checkout.review', {
			url: '/review',
			templateUrl: 'checkout/review/templates/checkout.review.html',
			controller: 'CheckoutReviewCtrl',
			controllerAs: 'checkoutReview',
			resolve: {
				LineItemsList: function(OrderCloudSDK, CurrentOrder) {
					return OrderCloudSDK.LineItems.List('outgoing', CurrentOrder.ID, {pageSize: 100});
				},
				OrderPaymentsDetail: function($q, OrderCloudSDK, CurrentOrder, $state) {
					return OrderCloudSDK.Payments.List('outgoing', CurrentOrder.ID)
						.then(function(data) {
							//TODO: create a queue that can be resolved
							var dfd = $q.defer();
							if (!data.Items.length) {
								dfd.reject();
								$state.go('checkout.shipping');
							}
							var queue = [];
							angular.forEach(data.Items, function(payment, index) {
								if (payment.Type === 'CreditCard' && payment.CreditCardID) {
									queue.push((function() {
										var d = $q.defer();
										OrderCloudSDK.Me.GetCreditCard(payment.CreditCardID)
											.then(function(cc) {
												data.Items[index].Details = cc;
												d.resolve();
											});
										return d.promise;
									})());
								}
								if (payment.Type === 'SpendingAccount' && payment.SpendingAccountID) {
									queue.push((function() {
										var d = $q.defer();
										OrderCloudSDK.Me.GetSpendingAccount(payment.SpendingAccountID)
											.then(function(sa) {
												data.Items[index].Details = sa;
												d.resolve();
											});
										return d.resolve();
									})());
								}
							});
							$q.all(queue)
								.then(function() {
									dfd.resolve(data);
								});
							return dfd.promise;
						});
				}
			}
		});
}