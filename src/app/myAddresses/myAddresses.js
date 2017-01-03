angular.module('orderCloud')
    .config(MyAddressesConfig)
    .controller('MyAddressesCtrl', MyAddressesController)
;

function MyAddressesConfig($stateProvider) {
    $stateProvider
        .state('myAddresses', {
            parent: 'account',
            url: '/addresses',
            templateUrl: 'myAddresses/templates/myAddresses.tpl.html',
            controller: 'MyAddressesCtrl',
            controllerAs: 'myAddresses',
            data: {
                pageTitle: "Personal Addresses"
            },
            resolve: {
                AddressList: function(OrderCloud) {
                    return OrderCloud.Me.ListAddresses(null, null, null, null, null, {Editable:true});
                }
            }
        });
}

function MyAddressesController($state, toastr, OrderCloud, OrderCloudConfirm, MyAddressesModal, AddressList) {
    var vm = this;
    vm.list = AddressList;
    vm.create = function() {
        MyAddressesModal.Create()
            .then(function() {
                toastr.success('Address Created', 'Success');
                $state.reload('myAddresses');
            });
    };

    vm.edit = function(address){
        MyAddressesModal.Edit(address)
            .then(function() {
                toastr.success('Address Saved', 'Success');
                $state.reload('myAddresses');
            });
    };

    vm.delete = function(scope) {
        vm.loading = [];
        OrderCloudConfirm.Confirm("Are you sure you want to delete this address?")
            .then(function() {
                vm.loading[scope.$index] = {
                    templateUrl:'common/loading-indicators/templates/view.loading.tpl.html',
                    message:null
                };
                vm.loading[scope.$index].promise = OrderCloud.Me.DeleteAddress(scope.address.ID)
                    .then(function() {
                        toastr.success('Address Deleted', 'Success');
                        $state.reload('myAddresses');
                    })
            })
            .catch(function() {

            });
    };

}