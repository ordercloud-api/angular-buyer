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
                SelectedOrder: function($stateParams, OrderCloudSDK){
                    return OrderCloudSDK.Orders.Get('outgoing', $stateParams.orderid);
                },
                OrderLineItems: function($stateParams, OrderCloudSDK){
                    return OrderCloudSDK.LineItems.List('outgoing', $stateParams.orderid);
                },
                OrderApprovals: function($stateParams, OrderCloudSDK) {
                    return OrderCloudSDK.Orders.ListApprovals('outgoing', $stateParams.orderid);
                },
                CanApprove: function($stateParams, OrderCloudSDK, CurrentUser){
                    return OrderCloudSDK.Orders.ListEligibleApprovers('outgoing', $stateParams.orderid, {filters:{ID: CurrentUser.ID}})
                        .then(function(userList){
                            return userList.Meta.TotalCount > 0;
                        });
                }
            }
        });
}