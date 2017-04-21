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
                pageTitle: 'Shopping Cart'
            },
            resolve: {
                LineItemsList: function(OrderCloudSDK, CurrentOrder) {
                    return OrderCloudSDK.LineItems.List('outgoing', CurrentOrder.ID);
                },
                CurrentPromotions: function(CurrentOrder, OrderCloudSDK) {
                    return OrderCloudSDK.Orders.ListPromotions('outgoing', CurrentOrder.ID);
                }
            }
        });
}