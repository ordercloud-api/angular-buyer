angular.module('orderCloud')
    .config(OrderShipmentsConfig)
;

function OrderShipmentsConfig($stateProvider) {
    $stateProvider 
        .state('orderDetail.shipments', {
            url: '/shipments',
            templateUrl: 'myOrders/shipments/templates/orderShipments.html',
            controller: 'OrderShipmentsCtrl',
            controllerAs: 'orderShipments',
            data: {
                pageTitle: 'Order Shipments'
            },
            resolve: {
                OrderShipments: function($stateParams, ocOrderShipments, OrderLineItems) {
                    return ocOrderShipments.List($stateParams.orderid, 1, 100, OrderLineItems);
                }
            }
        })
}