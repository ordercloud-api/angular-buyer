angular.module('orderCloud')
    .controller('MyAddressesCtrl', MyAddressesController)
;

function MyAddressesController(toastr, sdkOrderCloud, ocConfirm, ocMyAddresses, AddressList) {
    var vm = this;
    vm.list = AddressList;
    vm.create = function() {
        ocMyAddresses.Create()
            .then(function(data) {
                toastr.success('Address Created', 'Success');
                vm.list.Items.push(data);
            });
    };

    vm.edit = function(scope){
        ocMyAddresses.Edit(scope.address)
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
                vm.loading[scope.$index] = sdkOrderCloud.Me.DeleteAddress(scope.address.ID)
                    .then(function() {
                        toastr.success('Address Deleted', 'Success');
                        vm.list.Items.splice(scope.$index, 1);
                    })
            })
            .catch(function() {

            });
    };

}