angular.module('orderCloud')
    .controller('RepeatOrderModalCtrl', RepeatOrderModalCtrl)
;

function RepeatOrderModalCtrl(LineItems, OrderID, $uibModalInstance, $state, ocRepeatOrder){
    var vm = this;
    vm.orderid = OrderID;
    vm.invalidLI = LineItems.invalid;
    vm.validLI = LineItems.valid;


    vm.cancel = function(){
        $uibModalInstance.dismiss();
    };

    vm.submit = function(){
        vm.loading = {
            message:'Adding Products to Cart'
        };
        vm.loading.promise = ocRepeatOrder.AddLineItemsToCart(vm.validLI, vm.orderid)
            .then(function(){
                $uibModalInstance.close();
                $state.go('cart', {}, {reload: true});
            });
    };
}