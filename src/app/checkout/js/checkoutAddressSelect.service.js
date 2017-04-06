angular.module('orderCloud')
    .factory('ocAddressSelect', OrderCloudAddressSelectService)
;

function OrderCloudAddressSelectService($uibModal, sdkOrderCloud) {
    var service = {
        Open: _open
    };

    function _open(type) {
        return $uibModal.open({
            templateUrl: 'checkout/templates/addressSelect.modal.html',
            controller: 'AddressSelectCtrl',
            controllerAs: 'addressSelect',
            backdrop: 'static',
            size: 'md',
            resolve: {
                Addresses: function(sdkOrderCloud) {
                    var options = {
                        page: 1,
                        pageSize: 100
                    };

                    if (type == 'shipping') {
                        options.filters = {Shipping: true};
                    } else if (type == 'billing') {
                        options.filters = {Billing: true};
                    }

                    return sdkOrderCloud.Me.ListAddresses(options);
                }
            }
        }).result;
    }

    return service;
}