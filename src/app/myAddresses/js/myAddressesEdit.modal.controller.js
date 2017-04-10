angular.module('orderCloud')
    .controller('EditAddressModalCtrl', EditAddressModalController)
;

function EditAddressModalController($exceptionHandler, $uibModalInstance, OrderCloudSDK, ocGeography, SelectedAddress) {
    var vm = this;
    vm.countries = ocGeography.Countries;
    vm.states = ocGeography.States;
    vm.address = SelectedAddress;
    vm.addressID = angular.copy(SelectedAddress.ID);

    //default shipping/billing to true for personal addresses
    vm.address.Shipping = true;
    vm.address.Billing = true;

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    vm.submit = function() {
        vm.loading = {
            message:'Saving Address'
        };
        vm.loading.promise = OrderCloudSDK.Me.UpdateAddress(vm.addressID, vm.address)
            .then(function(address) {
                $uibModalInstance.close(address);
            })
            .catch(function(error) {
                $exceptionHandler(error);
            });
    };
}