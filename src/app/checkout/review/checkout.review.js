angular.module('orderCloud')
	.config(checkoutReviewConfig)
	.controller('CheckoutReviewCtrl', CheckoutReviewController);

function checkoutReviewConfig($stateProvider) {
	$stateProvider
		.state('checkout.review', {
			url: '/review',
			templateUrl: 'checkout/review/templates/checkout.review.html',
			controller: 'CheckoutReviewCtrl',
			controllerAs: 'checkoutReview',
			resolve: {
				LineItemsList: function($q, $state, toastr, OrderCloud, ocLineItems, CurrentOrder) {
					var dfd = $q.defer();
					OrderCloud.LineItems.List(CurrentOrder.ID)
						.then(function(data) {
							if (!data.Items.length) {
								dfd.resolve(data);
							}
							else {
								ocLineItems.GetProductInfo(data.Items)
									.then(function() {
										dfd.resolve(data);
									});
							}
						})
						.catch(function() {
							toastr.error('Your order does not contain any line items.', 'Error');
							dfd.reject();
						});
					return dfd.promise;
				},
				OrderPaymentsDetail: function($q, OrderCloud, CurrentOrder, $state) {
					return OrderCloud.Payments.List(CurrentOrder.ID)
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
										OrderCloud.Me.GetCreditCard(payment.CreditCardID)
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
										OrderCloud.Me.GetSpendingAccount(payment.SpendingAccountID)
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
						})

				}
			}
		});
}

function CheckoutReviewController(LineItemsList, OrderPaymentsDetail) {
	var vm = this;
	vm.payments = OrderPaymentsDetail;
	vm.lineItems = LineItemsList;
}