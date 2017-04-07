angular.module('orderCloud')
    .config(MyAddressesConfig)
;

function MyAddressesConfig($stateProvider) {
    $stateProvider
        .state('myAddresses', {
            parent: 'account',
            url: '/addresses',
            templateUrl: 'myAddresses/templates/myAddresses.html',
            controller: 'MyAddressesCtrl',
            controllerAs: 'myAddresses',
            data: {
                pageTitle: "Personal Addresses"
            },
            resolve: {
                AddressList: function(sdkOrderCloud) {
                    var options = {
                        filters: {Editable: true}
                    };
                    return sdkOrderCloud.Me.ListAddresses(options);
                }
            }
        });
}