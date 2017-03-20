angular.module('orderCloud')
    .config(OrderDetailConfig)
;

function OrderDetailConfig($stateProvider){
    $stateProvider
        .state('orderDetail', {
            url: '/order/:orderid',
            parent: 'account',
            templateUrl: 'orders/orderDetails/templates/orderDetails.html',
            controller: 'OrderDetailsCtrl',
            controllerAs: 'orderDetails',
             data: {
                pageTitle: 'Order'
            },
            resolve: {
                SelectedOrder: function($stateParams, ocOrderDetails){
                    return ocOrderDetails.Get($stateParams.orderid);
                },
                OrderLineItems: function($stateParams, OrderCloud){
                    return OrderCloud.LineItems.List($stateParams.orderid, null, 1, null, null, null, null, $stateParams.buyerid);
                }
            }
        });
}