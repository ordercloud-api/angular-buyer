angular.module('orderCloud')
    .factory('ocOrders', ocOrdersService)
;

function ocOrdersService(OrderCloud, $exceptionHandler){
    var service = {
        List: _list
    };
    
    function _list(Parameters, CurrentUser){
        var parameters = angular.copy(Parameters);
        parameters.filters = {Status: '!Unsubmitted'};

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

        // if(parameters.tab === 'history'){
        //     //
        // }

        // if(parameters.tab === 'approvals') {
        //     //
        // }

        if(parameters.tab === 'favorites') {

            if(CurrentUser.xp && CurrentUser.xp.FavoriteOrders) {
                angular.extend(parameters.filters, {ID: CurrentUser.xp.FavoriteOrders.join('|')});
            }
        }

        //create filter object for outgoing call. We don't want to use filters directly 
        //in params because it looks ugly (displays as deserialized object)

         // list orders with generated parameters
        var listType = parameters.tab === 'approvals' ? 'ListIncomingOrders' : 'ListOutgoingOrders';
        return OrderCloud.Me[listType](parameters.search, parameters.page, parameters.pageSize || 12, parameters.searchOn, parameters.sortBy, parameters.filters);
    }

    return service;
}