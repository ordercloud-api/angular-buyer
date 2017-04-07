angular.module('orderCloud')
	.controller('CheckoutPaymentCtrl', CheckoutPaymentController)
;

function CheckoutPaymentController($exceptionHandler, $rootScope, toastr, sdkOrderCloud, ocAddressSelect, ocMyAddresses) {
	var vm = this;
    vm.createAddress = createAddress;
    vm.changeBillingAddress = changeBillingAddress;

    function createAddress(order){
        return ocMyAddresses.Create()
            .then(function(address) {
                toastr.success('Address Created', 'Success');
                order.BillingAddressID = address.ID;
                saveBillingAddress(order);
            });
    }

    function changeBillingAddress(order) {
        ocAddressSelect.Open('billing')
            .then(function(address) {
                if (address == 'create') {
                    createAddress(order);
                } else {
                    order.BillingAddressID = address.ID;
                    saveBillingAddress(order);
                }
            });
    }

    function saveBillingAddress(order) {
        if (order && order.BillingAddressID) {
            sdkOrderCloud.Orders.Patch('outgoing', order.ID, {BillingAddressID: order.BillingAddressID})
                .then(function(updatedOrder) {
                    $rootScope.$broadcast('OC:OrderBillAddressUpdated', updatedOrder);
                })
                .catch(function(ex) {
                    $exceptionHandler(ex);
                });
        }
    }
}