angular.module('orderCloud')
    .controller('OrderDetailsCtrl', OrderDetailsController)
;

function OrderDetailsController($state, $stateParams, toastr, OrderCloudSDK, ocOrders, SelectedOrder, OrderLineItems, OrderApprovals, CanApprove) {
    var vm = this;
    vm.order = SelectedOrder;
    vm.approvals = OrderApprovals;
    vm.lineItems = OrderLineItems;
    vm.canApprove = CanApprove;

    vm.pageChanged = function() {
        var options = {
            page: vm.lineItems.Meta.Page,
            pageSize: vm.lineItems.Meta.PageSize
        };
        return OrderCloudSDK.LineItems.List('outgoing', $stateParams.orderid,  options)
            .then(function(data) {
                vm.lineItems = data;
            });
    };

    vm.loadMore = function() {
        var options = {
            page: vm.lineItems.Meta.Page++,
            pageSize: vm.lineItems.Meta.PageSize
        };
        return OrderCloudSDK.LineItems.List('outgoing', $stateParams.orderid, options)
            .then(function(data) {
                vm.lineItems.Items = vm.lineItems.Items.concat(data.Items);
                vm.lineItem.Meta = data.Meta;
            });
    };

    vm.updateApprovalStatus = function(intent){
        //intent is a string either 'Approve' or 'Decline'
        return ocOrders.UpdateApprovalStatus($stateParams.orderid, intent)
            .then(function() {
                toastr.success('Order ' + intent.toLowerCase() + 'd');
                $state.go('orders', {tab:'approvals'});
            });
    };
}