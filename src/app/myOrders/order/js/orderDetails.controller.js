angular.module('orderCloud')
    .controller('OrderDetailsCtrl', OrderDetailsController)
;

function OrderDetailsController($stateParams, OrderCloudSDK, SelectedOrder, OrderLineItems) {
    var vm = this;
    vm.order = SelectedOrder;
    vm.lineItems = OrderLineItems;

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
}