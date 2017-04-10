angular.module('orderCloud')
    .controller('CreateAddressModalCtrl', CreateAddressModalController)
;

function CreateAddressModalController($q, $exceptionHandler, $uibModalInstance, OrderCloudSDK, ocGeography) {
    var vm = this;
    vm.countries = ocGeography.Countries;
    vm.states = ocGeography.States;
    vm.address = {
        //defaults selected country to US
        Country: 'US',
        //default shipping/billing to true for personal addresses
        Shipping:true,
        Billing: true
    };

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    vm.submit = function() {
        vm.loading = {
            message:'Creating Address'
        };
        vm.loading.promise = OrderCloudSDK.Me.CreateAddress(vm.address)
            .then(function(address) {
                $uibModalInstance.close(address);
            })
            .catch(function(error) {
                $exceptionHandler(error);
            });
    };
}