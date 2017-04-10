angular.module('orderCloud')
    .config(OrdersConfig)
;

function OrdersConfig($stateProvider) {
    $stateProvider
        .state('orders', {
            parent: 'account',
            templateUrl: 'myOrders/orders/templates/orders.html',
            controller: 'OrdersCtrl',
            controllerAs: 'orders',
            data: {
                pageTitle: 'Orders'
            },
            url: '/orders/:tab?fromDate&toDate&search&page&pageSize&searchOn&sortBy&filters',
            resolve: {
                Parameters: function($stateParams, ocParameters){
                    return ocParameters.Get($stateParams);
                },
                OrderList: function(Parameters, CurrentUser, ocOrders){
                    return ocOrders.List(Parameters, CurrentUser);
                }
            }
        });
}