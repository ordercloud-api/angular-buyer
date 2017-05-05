angular.module('orderCloud')
    .factory('ocMyAddresses', OrderCloudMyAddressesService)
;

function OrderCloudMyAddressesService($uibModal) {
    return {
        Create: _create,
        Edit: _edit
    };

    function _create() {
        return $uibModal.open({
            templateUrl: 'myAddresses/templates/myAddresses.create.modal.html',
            controller: 'CreateAddressModalCtrl',
            controllerAs: 'createAddress',
            size: 'md'
        }).result;
    }

    function _edit(address) {
        var addressCopy = angular.copy(address);
        return $uibModal.open({
            templateUrl: 'myAddresses/templates/myAddresses.edit.modal.html',
            controller: 'EditAddressModalCtrl',
            controllerAs: 'editAddress',
            size: 'md',
            resolve: {
                SelectedAddress: function() {
                    return addressCopy;
                }
            }
        }).result;
    }
}