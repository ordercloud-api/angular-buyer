angular.module('orderCloud')
    .config(ApprovalsConfig)
;

function ApprovalsConfig($stateProvider){
    $stateProvider
        .state('orderDetail.approvals', {
            url: '/approvals',
            templateUrl: 'myOrders/approvals/templates/approvals.html',
            controller: 'OrderApprovalsCtrl',
            controllerAs: 'orderApprovals',
            data: {
                pageTitle: 'Order Approvals'
            },
            resolve: {
                OrderApprovals: function($stateParams, ocApprovals) {
                    return ocApprovals.List($stateParams.orderid, $stateParams.buyerid, 1, 100);
                },
                CanApprove: function(CurrentUser, $stateParams, OrderCloud){
                    return OrderCloud.Orders.ListEligibleApprovers($stateParams.orderid, null, 1, 100)
                        .then(function(userList){
                            var userIDs = _.pluck(userList.Items, 'ID');
                            return userIDs.indexOf(CurrentUser.ID) > -1;
                        });
                }
            }
        });
}