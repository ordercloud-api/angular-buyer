angular.module('orderCloud')
    .factory('ocOrders', ocOrdersService)
;

function ocOrdersService($uibModal, $filter, OrderCloudSDK){
    var service = {
        List: _list,
        UpdateApprovalStatus: _updateApprovalStatus
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

        parameters.pageSize = parameters.pageSize ? parameters.pageSize : 12;

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

        if (parameters.tab === 'approvals') {
            return OrderCloudSDK.Me.ListApprovableOrders(parameters);
        } else {
            if(parameters.status){
                angular.extend(parameters.filters, {status: parameters.status});
            } else {
                //TODO: replace with "!Unsubmitted" when ! operator is fixed in API EX-1166
                angular.extend(parameters.filters, {status: 'Open|AwaitingApproval|Completed|Declined|Cancelled'});
            }
            return OrderCloudSDK.Me.ListOrders(parameters);
        }
    }

    function _updateApprovalStatus(orderID, intent){
        return $uibModal.open({
            templateUrl: 'myOrders/orders/templates/approval.modal.html',
            controller: 'ApprovalModalCtrl',
            controllerAs: 'approvalModal',
            size: 'md',
            resolve: {
                OrderID: function() {
                    return orderID;
                },
                Intent: function(){
                    return intent;
                }
            }
        }).result;
    }

    return service;
}