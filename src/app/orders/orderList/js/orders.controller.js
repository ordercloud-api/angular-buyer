angular.module('orderCloud')
    .controller('OrdersCtrl', OrdersController)
;

function OrdersController($state, $filter, $ocMedia, OrderCloud, ocParameters, ocOrders, OrderList, Parameters) {
    var vm = this;
    vm.list = OrderList;
    vm.parameters = Parameters;
    //need this here to display in uib-datepicker (as date obj) but short date (string) in url
    vm.fromDate = Parameters.fromDate;
    vm.toDate = Parameters.toDate;

    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') == 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;
    vm.filtersApplied = vm.parameters.fromDate || vm.parameters.toDate || ($ocMedia('max-width:767px') && vm.sortSelection); //Check if filters are applied, Sort by is a filter on mobile devices
    vm.showFilters = vm.filtersApplied;
    vm.searchResults = Parameters.search && Parameters.search.length > 0; //Check if search was used

    /*       
        Filter / Search / Sort / Pagination functions               
    */
    vm.filter = filter; //Reload the state with new parameters
    vm.search = search; //Reload the state with new search parameter & reset the 
    vm.clearSearch = clearSearch; //Clear the search parameter, reload the state & reset the page
    vm.clearFilters = clearFilters; //Clear relevant filters, reload the state & reset the page
    vm.updateSort = updateSort;  //Conditionally set, reverse, remove the sortBy parameter & reload the state
    vm.reverseSort = reverseSort; //Used on mobile devices
    vm.pageChanged = pageChanged; //Reload the state with the incremented page parameter
    vm.loadMore = loadMore; //Load the next page of results with all of the same parameters, used on mobile

    vm.selectTab = selectTab;
    vm.goToOrder = goToOrder;

    function selectTab(tab){
        vm.parameters.tab = tab;
        vm.filter(true);
    }

    function goToOrder(order){
        if(vm.parameters.tab === 'approvals') {
            $state.go('orderDetail.approvals', {orderid: order.ID});
        } else {
            $state.go('orderDetail', {orderid: order.ID});
        }
    }

    function filter(resetPage) {
        formatDate();
        $state.go('.', ocParameters.Create(vm.parameters, resetPage));
    }

    function formatDate(){
        //formats date as string to display in url
        if(vm.fromDate) vm.parameters.from = $filter('date')(angular.copy(vm.fromDate), 'MM-dd-yyyy');
        if(vm.toDate) vm.parameters.to = $filter('date')(angular.copy(vm.toDate), 'MM-dd-yyyy');
    }
    
    function search() {
        vm.filter(true);
    }
    
    function clearSearch() {
        vm.parameters.search = null;
        vm.filter(true);
    }

    function clearFilters() {
        vm.parameters.status = null;
        vm.parameters.coffeeshop = null;
        vm.parameters.from = null;
        vm.parameters.to = null;
        $ocMedia('max-width:767px') ? vm.parameters.sortBy = null : angular.noop(); //Clear out sort by on mobile devices
        vm.filter(true);
    }

    function updateSort(value) {
        value ? angular.noop() : value = vm.sortSelection;
        switch(vm.parameters.sortBy) {
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
        Parameters.sortBy.indexOf('!') == 0 ? vm.parameters.sortBy = Parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    }

    function pageChanged() {
        $state.go('.', {page:vm.list.Meta.Page});
    }

    function loadMore() {
        return ocOrders.ListOrders(vm.parameters)
            .then(function(data){
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
        });
    }
}