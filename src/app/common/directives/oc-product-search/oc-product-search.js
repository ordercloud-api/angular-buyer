angular.module('orderCloud')
    .directive('ocProductSearch', OrderCloudProductSearchComponent)
    .controller('ProductSearchComponentCtrl', ProductSearchComponentController);

function OrderCloudProductSearchComponent() {
    return {
        templateUrl: 'common/directives/oc-product-search/oc-product-search.html',
        controller: 'ProductSearchComponentCtrl',
        controllerAs: '$ctrl',
        scope: {
            maxProducts: '<',
            catalogid: '<'
        }
    };
}

function ProductSearchComponentController($state, OrderCloudSDK) {
    var vm = this;

    vm.getSearchResults = function () {
        var parameters = {
            catalogID: vm.catalogid,
            search: vm.searchTerm,
            page: 1,
            pageSize: vm.maxProducts || 5,
            depth: 'all'
        };
        return OrderCloudSDK.Me.ListProducts(parameters)
            .then(function (data) {
                return data.Items;
            })
            .catch(function(ex) {
                return ex;
            });
    };

    vm.onSelect = function (productID) {
        $state.go('productDetail', {
            productid: productID
        }).then(_resetForm);
    };

    vm.onHardEnter = function (searchTerm) {
        $state.go('productBrowse.products', {
                catalogid: vm.catalogid,
                search: searchTerm,
                categoryid: ''
            })
            .then(_resetForm);
    };

    function _resetForm() {
        vm.noResults = false;
        vm.loading = false;
        vm.searchTerm = null;
        vm.form.productsearch.$$element[0].blur();
    }
}