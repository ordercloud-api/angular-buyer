angular.module('orderCloud')
    .controller('RepeatOrderCtrl', RepeatOrderCtrl)
;

function RepeatOrderCtrl(toastr, ocRepeatOrder, $uibModal) {
    var vm = this;

    vm.$onInit = function() {
        if (vm.orderid === 'undefined') toastr.error('repeat order component is not configured correctly. orderid is a required attribute', 'Error');
    };

    vm.openReorderModal = function(){
        $uibModal.open({
            templateUrl: 'repeatOrder/templates/repeatOrder.modal.html',
            controller:  'RepeatOrderModalCtrl',
            controllerAs: 'repeatModal',
            size: 'md',
            resolve: {
                OrderID: function() {
                    return vm.currentOrderId;
                },
                LineItems: function() {
                    return ocRepeatOrder.GetValidLineItems(vm.originalOrderId);
                }
            }
        });
    };
}