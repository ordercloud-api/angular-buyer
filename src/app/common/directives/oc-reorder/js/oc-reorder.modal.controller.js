angular.module('orderCloud')
    .controller('ReorderModalCtrl', ReorderModalController)
;

function ReorderModalController($state, $uibModalInstance, ocReorder, LineItems, OrderID){
    var vm = this;
    vm.orderid = OrderID;
    vm.invalidLI = LineItems.invalid;
    vm.validLI = LineItems.valid;

    vm.cancel = cancel;
    vm.submit = submit;

    function cancel(){
        return $uibModalInstance.dismiss();
    }

    function submit(){
        vm.loading = {
            message:'Adding Products to Cart'
        };
        vm.loading.promise = ocReorder.AddLineItemsToCart(vm.validLI, vm.orderid)
            .then(function(){
                $uibModalInstance.close();
                $state.go('cart', {}, {reload: true});
            });
    }
}