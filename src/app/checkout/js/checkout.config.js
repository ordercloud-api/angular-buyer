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
                IdentifyUser: function($state, ocAnonymous, CurrentUser) {
                    if (CurrentUser.Anonymous) {
                        ocAnonymous.Identify('cart')
                            .then(function(data) {
                                //TODO: placeholder for guest checkout functionality
                            })
                            .catch(function(ex) {
                                if (ex === 'LOGIN') {
                                    $state.go('login');
                                } else if (ex === 'REGISTER') {
                                    $state.go('register');
                                } else {
                                    //User closed the modal
                                    $state.go('cart');
                                }
                            });
                    } else {
                        return;
                    }
                },
                OrderShipAddress: function($q, OrderCloudSDK, CurrentOrder){
                    var deferred = $q.defer();
                    if (CurrentOrder.ShippingAddressID) {
                        OrderCloudSDK.Me.GetAddress(CurrentOrder.ShippingAddressID)
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
                CurrentPromotions: function(CurrentOrder, OrderCloudSDK) {
                    return OrderCloudSDK.Orders.ListPromotions('outgoing', CurrentOrder.ID);
                },
                OrderBillingAddress: function($q, OrderCloudSDK, CurrentOrder){
                    var deferred = $q.defer();

                    if (CurrentOrder.BillingAddressID) {
                        OrderCloudSDK.Me.GetAddress(CurrentOrder.BillingAddressID)
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