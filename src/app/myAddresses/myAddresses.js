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

function MyAddressesController(toastr, OrderCloud, ocConfirm, MyAddressesModal, AddressList) {
    var vm = this;
    vm.list = AddressList;
    vm.create = function() {
        MyAddressesModal.Create()
            .then(function(data) {
                toastr.success('Address Created', 'Success');
                vm.list.Items.push(data);
            });
    };

    vm.edit = function(scope){
        MyAddressesModal.Edit(scope.address)
            .then(function(data) {
                toastr.success('Address Saved', 'Success');
                vm.list.Items[scope.$index] = data;
            });
    };

    vm.delete = function(scope) {
        vm.loading = [];
        ocConfirm.Confirm({
                message:'Are you sure you want to delete <br> <b>' + (scope.address.AddressName ? scope.address.AddressName : scope.address.ID) + '</b>?',
                confirmText: 'Delete address',
                type: 'delete'})
            .then(function() {
                vm.loading[scope.$index] = OrderCloud.Me.DeleteAddress(scope.address.ID)
                    .then(function() {
                        toastr.success('Address Deleted', 'Success');
                        vm.list.Items.splice(scope.$index, 1);
                    })
            })
            .catch(function() {

            });
    };

}