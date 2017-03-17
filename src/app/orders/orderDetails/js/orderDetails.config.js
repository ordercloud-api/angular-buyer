angular.module('orderCloud')
    .config(OrderDetailConfig)
;

function OrderDetailConfig($stateProvider){
    $stateProvider
        .state('orderDetail', {
            url: '/order/:orderid',
            parent: 'account',
            templateUrl: 'orders/orderDetails/templates/orderDetails.html',
            controller: 'OrderDetailCtrl',
            controllerAs: 'orderDetails',
             data: {
                pageTitle: 'Order'
            },
            resolve: {
                SelectedOrder: function($stateParams, ocOrderDetail){
                    return ocOrderDetail.GetOrderDetails($stateParams.orderid);
                },
                OrderLineItems: function($stateParams, OrderCloud){
                    return OrderCloud.LineItems.List($stateParams.orderid, null, 1, null, null, null, null, $stateParams.buyerid);
                }
            }
        });
}