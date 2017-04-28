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
                CanApprove: function(CurrentUser, $stateParams, OrderCloudSDK){
                    var parameters = {
                        page: 1,
                        pageSize: 100
                    };
                    return OrderCloudSDK.Orders.ListEligibleApprovers('outgoing', $stateParams.orderid, parameters)
                        .then(function(userList){
                            var userIDs = _.pluck(userList.Items, 'ID');
                            return userIDs.indexOf(CurrentUser.ID) > -1;
                        });
                }
            }
        });
}