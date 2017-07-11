angular.module('orderCloud')
    .config(OrderPaymentsConfig)
;

function OrderPaymentsConfig($stateProvider) {
    $stateProvider
        .state('orderDetail.payments', {
            url: '/payments',
            templateUrl: 'myOrders/payments/templates/orderPayments.html',
            controller: 'OrderPaymentsCtrl',
            controllerAs: 'orderPayments',
            data: {
                pageTitle: 'Order Payments'
            },
            resolve: {
                OrderPayments: function($stateParams, ocOrderPayments) {
                    return ocOrderPayments.List($stateParams.orderid, 1, null);
                }
            }
        })
    ;
}