angular.module('orderCloud')
    .controller('FavoriteProductsCtrl', FavoriteProductsController)
;

function FavoriteProductsController(ocParameters, OrderCloudSDK, $state, $ocMedia, Parameters, CurrentUser, FavoriteProducts){
    var vm = this;
    vm.currentUser = CurrentUser;
    vm.list = FavoriteProducts;
    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;

    //Filtering and Search Functionality
    //check if filters are applied
    vm.filtersApplied = vm.parameters.filters || ($ocMedia('max-width: 767px') && vm.sortSelection);
    vm.showFilters = vm.filtersApplied;
    vm.filter = filter; //reload the state with new filters
    vm.clearFilters = clearFilters; //clear the relevant filters, reload the state & reset the page
    vm.updateSort = updateSort;
    vm.reverseSort = reverseSort;
    vm.pageChanged = pageChanged; //reload the state with the incremented page parameter
    vm.loadMore = loadMore; //load the next page of results with all the same parameters
    
    function filter(resetPage) {
        $state.go('.', ocParameters.Create(vm.parameters, resetPage));
    }

    function clearFilters() {
        vm.parameters.filters = null;
        $ocMedia('max-width: 767px') ? vm.parameters.sortBy = null : angular.noop();
        vm.filter(true);
    }

    function updateSort(value) {
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
    }

    function reverseSort() {
        vm.parameters.sortBy.indexOf('!') === 0 ? vm.parameters.sortBy = vm.parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + vm.parameters.sortBy;
        vm.filter(false);
    }

    function pageChanged() {
        $state.go('.', {
            page: vm.list.Meta.Page
        });
    }

    function loadMore() {
        var parameters = angular.extend(Parameters, {page:vm.list.Meta.Page + 1});
        return OrderCloudSDK.Me.ListProducts(parameters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    }
}