angular.module('orderCloud')
    .factory('ocApprovals', ocApprovals)
;

function ocApprovals($q, $uibModal, $state, OrderCloudSDK){
    var service = {
        List: _list,
        UpdateApprovalStatus: _updateApprovalStatus
    };

    function _list(orderID, buyerID, page, pageSize) {
        var deferred = $q.defer();

        var options = {
            page: page,
            pageSize: pageSize,
            sortBy: 'Status'
        };
        OrderCloudSDK.Orders.ListApprovals('outgoing', orderID, options)
            .then(function(data) {
                getApprovingUserGroups(data);
            });

        function getApprovingUserGroups(data) {
            var userGroupIDs = _.uniq(_.pluck(data.Items, 'ApprovingGroupID'));
            var options = {
                page: 1,
                pageSize: 100,
                filters: {ID: userGroupIDs.join('|')}
            };
            OrderCloudSDK.UserGroups.List(buyerID, options)
                .then(function(userGroupList) {
                    _.each(data.Items, function(approval) {
                        approval.ApprovingUserGroup = _.findWhere(userGroupList.Items, {ID: approval.ApprovingGroupID});
                    });
                    getApprovingUsers(data);
                })
                .catch(function() {
                    getApprovingUsers(data);
                });
        }

        function getApprovingUsers(data){
            var userIDs = _.compact(_.uniq(_.pluck(data.Items, 'ApproverID')));
            var options = {
                page: 1,
                pageSize: 100,
                filters: {ID: userIDs.join('|')}
            };
            OrderCloudSDK.Users.List(buyerID, options)
                .then(function(userList){
                    _.each(data.Items, function(approval){
                        if(approval.Status !== 'Pending') approval.ApprovingUser = _.findWhere(userList.Items, {ID: approval.ApproverID});
                    });
                    getApprovalRules(data);
                })
                .catch(function(){
                    getApprovalRules(data);
                });
        }

        function getApprovalRules(data) {
            var approvalRuleIDs = _.pluck(data.Items, 'ApprovalRuleID');
            var options = {
                page: 1,
                pageSize: 100,
                filters: {ID: approvalRuleIDs.join('|')}
            };
            OrderCloudSDK.ApprovalRules.List(buyerID, options)
                .then(function(approvalRuleData) {
                    angular.forEach(data.Items, function(approval) {
                        approval.ApprovalRule = _.findWhere(approvalRuleData.Items, {ID: approval.ApprovalRuleID});
                    });
                    deferred.resolve(data);
                })
                .catch(function() {
                    deferred.resolve(data);
                });
        }

        return deferred.promise;
    }

    function _updateApprovalStatus(orderID, intent){
        return $uibModal.open({
            templateUrl: 'orders/orderApprovals/templates/approve.modal.html',
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
        }).result
            .then(function(){
                $state.reload();
            });
    }

    return service;
}