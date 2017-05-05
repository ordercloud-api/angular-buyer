angular.module('orderCloud')
    .controller('ProductSearchCtrl', ProductSearchController)
;

function ProductSearchController($state, OrderCloudSDK, ocParameters, Parameters, ProductList) {
    var vm = this;
    vm.list = ProductList;
    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;

    //Reload the state with new parameters
    vm.filter = function(resetPage) {
        $state.go('.', ocParameters.Create(vm.parameters, resetPage));
    };

    vm.updateSort = function(value) {
        value ? angular.noop() : value = vm.sortSelection;
        switch (vm.parameters.sortBy) {
            case value:
                vm.parameters.sortBy = '!' + value;
                break;
            case '!' + value:
                vm.parameters.sortBy = null;
                break;
            default:
                vm.parameters.sortBy = value;
        }
        vm.filter(false);
    };

    vm.updatePageSize = function(pageSize) {
        vm.parameters.pageSize = pageSize;
        vm.filter(true);
    };

    vm.pageChanged = function(page) {
        vm.parameters.page = page;
        vm.filter(false);
    };

    vm.loadMore = function() {
        var parameters = angular.extend(Parameters, {page:vm.list.Meta.Page + 1});
        return OrderCloudSDK.Me.ListProducts(parameters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };

    vm.reverseSort = function() {
        Parameters.sortBy.indexOf('!') === 0 ? vm.parameters.sortBy = Parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    };
}