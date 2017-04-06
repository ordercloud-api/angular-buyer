angular.module('orderCloud')
    .config(CartConfig)
;

function CartConfig($stateProvider) {
    $stateProvider
        .state('cart', {
            parent: 'base',
            url: '/cart',
            templateUrl: 'cart/templates/cart.html',
            controller: 'CartCtrl',
            controllerAs: 'cart',
            data: {
                pageTitle: "Shopping Cart"
            },
            resolve: {
                LineItemsList: function($q, $state, toastr, sdkOrderCloud, ocLineItems, CurrentOrder) {
                    var dfd = $q.defer();
                    sdkOrderCloud.LineItems.List('outgoing', CurrentOrder.ID)
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
                CurrentPromotions: function(CurrentOrder, sdkOrderCloud) {
                    return sdkOrderCloud.Orders.ListPromotions('outgoing', CurrentOrder.ID);
                }
            }
        });
}