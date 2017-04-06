angular.module('orderCloud')
    .controller('ProductSearchModalCtrl', ProductSearchModalController)
;

function ProductSearchModalController($uibModalInstance, $timeout, $scope, sdkOrderCloud, catalogid) {
    var vm = this;

    $timeout(function() {
        $('#ProductSearchInput').focus();
    }, 300);

    vm.getSearchResults = function() {
        var parameters = {
            catalogID: catalogid,
            search: vm.searchTerm,
            page: 1,
            pageSize: vm.maxProducts || 5,
            depth: 'all'
        };
        return sdkOrderCloud.Me.ListProducts(parameters)
            .then(function(data) {
                return data.Items;
            });
    };

    //Mobile functionality
    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    vm.onSelect = function(productID) {
        $uibModalInstance.close({productID: productID});
    };

    vm.onHardEnter = function(searchTerm) {
        $uibModalInstance.close({searchTerm: searchTerm});
    };
}