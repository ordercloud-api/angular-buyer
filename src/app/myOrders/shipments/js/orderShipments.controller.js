angular.module('orderCloud')
    .controller('OrderShipmentsCtrl', OrderShipmentsController)
;

function OrderShipmentsController($stateParams, OrderShipments, OrderLineItems) {
    var vm = this;
    vm.list = OrderShipments;
    vm.orderID = $stateParams.orderid;

    vm.pageChanged = function() {
        ocOrderShipmentsService.List($stateParams.orderid, vm.list.Meta.Page, vm.list.Meta.PageSize, OrderLineItems)
            .then(function(data) {
                vm.list = data;
            });
    };

    vm.loadMore = function() {
        vm.list.Meta.Page++;
        ocOrderShipmentsService.List($stateParams.orderid, vm.list.Meta.Page, vm.list.Meta.PageSize, OrderLineItems)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };

    vm.selectShipment = function(shipment) {
        vm.selectedShipment = angular.copy(shipment);
    };
    if (vm.list.Items.length) vm.selectShipment(vm.list.Items[0]);
}