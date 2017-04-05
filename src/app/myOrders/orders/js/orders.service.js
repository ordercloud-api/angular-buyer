angular.module('orderCloud')
    .factory('ocOrders', ocOrdersService)
;

function ocOrdersService(sdkOrderCloud){
    var service = {
        List: _list
    };
    
    function _list(Parameters, CurrentUser){
        var parameters = angular.copy(Parameters);

        //exclude unsubmitted orders from list
        //parameters.filters = {Status: '!Unsubmitted'};  //TODO: Uncomment this line when API ! is fixed

        //set outgoing params to iso8601 format as expected by api
        //set returning params to date object as expected by uib-datepicker
        if(parameters.from) {
            var fromDateObj = new Date(parameters.from);
            Parameters.fromDate = fromDateObj;
            parameters.from = (fromDateObj).toISOString();
        }
        if(parameters.to) {
            var toDateObj = new Date(parameters.to);
            Parameters.toDate = toDateObj;
            parameters.to = (toDateObj).toISOString();
        }

        // DateSubmitted calculated with from/to parameters
        if(parameters.from && parameters.to) {
            parameters.filters.DateSubmitted = [('>' + parameters.from), ('<' + parameters.to)];
        } else if(parameters.from && !parameters.to) {
            parameters.filters.DateSubmitted = [('>' + parameters.from)];
        } else if (!parameters.from && parameters.to) {
            parameters.filters.DateSubmitted = [('<' + parameters.to)];
        }

        if(parameters.tab === 'favorites') {
            if(CurrentUser.xp && CurrentUser.xp.FavoriteOrders) {
                angular.extend(parameters.filters, {ID: CurrentUser.xp.FavoriteOrders.join('|')});
            }
        }

        if(parameters.status){
            angular.extend(parameters.filters, {Status: parameters.status});
        }

        parameters.pageSize = parameters.pageSize ? parameters.pageSize : 12;

        if (parameters.tab == 'approvals') {
            return sdkOrderCloud.Me.ListApprovableOrders(parameters);
        } else {
            return sdkOrderCloud.Me.ListOrders(parameters);
        }
    }

    return service;
}