angular.module('orderCloud')
    .component('ordercloudProductSearch', OrderCloudProductSearchComponent())
    .controller('ProductSearchComponentCtrl', ProductSearchComponentController)
;

function OrderCloudProductSearchComponent() {
    return {
        replace:true,
        templateUrl: 'productSearch/templates/productSearch.component.html',
        controller: 'ProductSearchComponentCtrl',
        bindings: {
            maxProducts: '<'
        }
    };
}

function ProductSearchComponentController($state, OrderCloudSDK, catalogid) {
    var vm = this;

    vm.getSearchResults = function() {
        var parameters = {
            catalogID: catalogid,
            search: vm.searchTerm,
            page: 1,
            pageSize: vm.maxProducts || 5,
            depth: 'all'
        };
        return OrderCloudSDK.Me.ListProducts(parameters)
            .then(function(data) {
                return data.Items;
            });
    };

    vm.onSelect = function(productID) {
        $state.go('productDetail', {
            productid: productID
        });
    };

    vm.onHardEnter = function(searchTerm) {
        $state.go('productSearchResults', {
            searchTerm: searchTerm
        });
    };
}