angular.module('orderCloud')
    .controller('OrderDetailsCtrl', OrderDetailsController)
;

function OrderDetailsController($stateParams, OrderCloud, SelectedOrder, OrderLineItems) {
    var vm = this;
    vm.order = SelectedOrder;
    vm.lineItems = OrderLineItems;

    vm.pageChanged = function() {
        return OrderCloud.LineItems.List($stateParams.orderid, null, vm.lineItems.Meta.Page, vm.lineItems.Meta.PageSize, null, null, null, $stateParams.buyerid)
            .then(function(data) {
                vm.lineItems = data;
            });
    };

    vm.loadMore = function() {
        vm.lineItems.Meta.Page++;
        return OrderCloud.LineItems.List($stateParams.orderid, null, vm.lineItems.Meta.Page, vm.lineItems.Meta.PageSize, null, null, null, $stateParams.buyerid)
            .then(function(data) {
                vm.lineItems.Items = vm.lineItems.Items.concat(data.Items);
                vm.lineItem.Meta = data.Meta;
            });
    };
}