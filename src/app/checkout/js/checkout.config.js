angular.module('orderCloud')
	.config(CheckoutConfig)
;

function CheckoutConfig($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('/checkout', '/checkout/shipping');
	$stateProvider
		.state('checkout', {
            abstract:true,
			parent: 'base',
			url: '/checkout',
			templateUrl: 'checkout/templates/checkout.html',
			controller: 'CheckoutCtrl',
			controllerAs: 'checkout',
			resolve: {
                OrderShipAddress: function($q, sdkOrderCloud, CurrentOrder){
                    var deferred = $q.defer();
                    if (CurrentOrder.ShippingAddressID) {
                        sdkOrderCloud.Me.GetAddress(CurrentOrder.ShippingAddressID)
                            .then(function(address) {
                                deferred.resolve(address);
                            })
                            .catch(function(ex) {
                                deferred.resolve(null);
                            });
                    }
                    else {
                        deferred.resolve(null);
                    }

                    return deferred.promise;
                },
                CurrentPromotions: function(CurrentOrder, sdkOrderCloud) {
                    return sdkOrderCloud.Orders.ListPromotions('outgoing', CurrentOrder.ID);
                },
                OrderBillingAddress: function($q, sdkOrderCloud, CurrentOrder){
                    var deferred = $q.defer();

                    if (CurrentOrder.BillingAddressID) {
                        sdkOrderCloud.Me.GetAddress(CurrentOrder.BillingAddressID)
                            .then(function(address) {
                                deferred.resolve(address);
                            })
                            .catch(function(ex) {
                                deferred.resolve(null);
                            });
                    }
                    else {
                        deferred.resolve(null);
                    }
                    return deferred.promise;
                }
			}
		})
    ;
}