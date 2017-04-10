angular.module('orderCloud')
    .factory('ocAddressSelect', OrderCloudAddressSelectService)
;

function OrderCloudAddressSelectService($uibModal, OrderCloudSDK) {
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
                Addresses: function(OrderCloudSDK) {
                    var options = {
                        page: 1,
                        pageSize: 100
                    };

                    if (type == 'shipping') {
                        options.filters = {Shipping: true};
                    } else if (type == 'billing') {
                        options.filters = {Billing: true};
                    }

                    return OrderCloudSDK.Me.ListAddresses(options);
                }
            }
        }).result;
    }

    return service;
}