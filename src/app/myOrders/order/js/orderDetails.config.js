angular.module('orderCloud')
    .config(OrderDetailConfig)
;

function OrderDetailConfig($stateProvider){
    $stateProvider
        .state('orderDetail', {
            url: '/order/:orderid',
            parent: 'account',
            templateUrl: 'myOrders/order/templates/orderDetails.html',
            controller: 'OrderDetailsCtrl',
            controllerAs: 'orderDetails',
             data: {
                pageTitle: 'Order'
            },
            resolve: {
                SelectedOrder: function($stateParams, ocOrderDetails){
                    return ocOrderDetails.Get($stateParams.orderid);
                },
                OrderLineItems: function($stateParams, OrderCloudSDK){
                    return OrderCloudSDK.LineItems.List('outgoing', $stateParams.orderid);
                }
            }
        });
}