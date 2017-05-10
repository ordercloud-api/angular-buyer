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
                OrderApprovals: function($stateParams, ocApprovals, buyerid) {
                    return ocApprovals.List($stateParams.orderid, buyerid);
                },
                CanApprove: function(CurrentUser, $stateParams, OrderCloudSDK){
                    return OrderCloudSDK.Orders.ListEligibleApprovers('outgoing', $stateParams.orderid, {pageSize: 100})
                        .then(function(userList){
                            var userIDs = _.pluck(userList.Items, 'ID');
                            return userIDs.indexOf(CurrentUser.ID) > -1;
                        });
                }
            }
        });
}