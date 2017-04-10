angular.module('orderCloud')
    .factory('ocOrders', ocOrdersService)
;

function ocOrdersService($filter, OrderCloudSDK){
    var service = {
        List: _list
    };
    
    function _list(Parameters, CurrentUser){
        var parameters = angular.copy(Parameters);

        //exclude unsubmitted orders from list
        //parameters.filters = {Status: '!Unsubmitted'};  //TODO: Uncomment this line when API ! is fixed

        function convertToDate(toDate) {
            var result = new Date(toDate);
            result = result.setDate(result.getDate() + 1);
            return $filter('date')(result, 'MM-dd-yyyy');
        }

        if (parameters.fromDate && parameters.toDate) {
            parameters.filters.DateSubmitted = [('>' + parameters.fromDate), ('<' + convertToDate(parameters.toDate))];
        } else if(parameters.fromDate && !parameters.toDate) {
            parameters.filters.DateSubmitted = [('>' + parameters.fromDate)];
        } else if (!parameters.fromDate && parameters.toDate) {
            parameters.filters.DateSubmitted = [('<' + convertToDate(parameters.toDate))];
        }

        if(parameters.tab === 'favorites') {
            if (CurrentUser.xp && CurrentUser.xp.FavoriteOrders) {
                angular.extend(parameters.filters, {ID: CurrentUser.xp.FavoriteOrders.join('|')});
            }
            else {
                angular.extend(parameters.filters, {ID: ''});
            }
        }

        if(parameters.status){
            angular.extend(parameters.filters, {Status: parameters.status});
        }

        parameters.pageSize = parameters.pageSize ? parameters.pageSize : 12;

        if (parameters.tab == 'approvals') {
            return OrderCloudSDK.Me.ListApprovableOrders(parameters);
        } else {
            return OrderCloudSDK.Me.ListOrders(parameters);
        }
    }

    return service;
}