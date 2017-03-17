angular.module('orderCloud')
    .config(ApprovalsConfig)
;

function ApprovalsConfig($stateProvider){
    $stateProvider
        .state('orderDetail.approvals', {
            url: '/approvals',
            templateUrl: 'orders/orderApprovals/templates/orderApprovals.html',
            controller: 'OrderApprovalsCtrl',
            controllerAs: 'orderApprovals',
            data: {
                pageTitle: 'Order Approvals'
            },
            resolve: {
                OrderApprovals: function($stateParams, ocApprovals) {
                    return ocApprovals.List($stateParams.orderid, $stateParams.buyerid, 1, 100);
                }
            }
        });
}