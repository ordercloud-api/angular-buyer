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
                OrderPayments: function($stateParams, ocOrderPayments, buyerid) {
                    return ocOrderPayments.List($stateParams.orderid, buyerid, 1, null);
                }
            }
        })
    ;
}