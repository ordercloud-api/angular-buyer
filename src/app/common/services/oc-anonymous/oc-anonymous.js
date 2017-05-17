angular.module('orderCloud')
    .factory('ocAnonymous', OrderCloudAnonymousService)
;

function OrderCloudAnonymousService($q, $state, $cookies, $uibModal, OrderCloudSDK, ocLineItems, ocAppName, defaultstate) {
    var service = {
        Redirect: _redirect,
        RemoveRedirect: _removeRedirect,
        Identify: _identify,
        MergeOrders: _mergeOrders
    };

    var returnStateCookieName = ocAppName.Watch().replace(/ /g, '_').toLowerCase() + '.return_state';

    function _redirect() {
        var returnstate = $cookies.get(returnStateCookieName);
        if (returnstate) {
            $state.go(returnstate);
        } else {
            $state.go(defaultstate);
        }
    }

    function _removeRedirect() {
        $cookies.remove(returnStateCookieName);
    }

    function _identify(returnState) {
        if (returnState) $cookies.put(returnStateCookieName, returnState);
        return $uibModal.open({
            templateUrl: 'common/services/oc-anonymous/identify.modal.html',
            controller: 'IdentifyModalCtrl',
            controllerAs: 'identifyModal'
        }).result;
    }


    function _mergeOrders(anonymousToken) {
        var df = $q.defer();
        var transferLineItems = [];
        var oldOrderID;
        //get the users latest unsubmitted order & all the line items
        if (!anonymousToken) {
            df.resolve();
        } else {
            OrderCloudSDK.Me.ListOrders({page: 1, pageSize: 1, sortBy: '!DateCreated', filters: {Status: 'Unsubmitted'}})
                .then(function(data) {
                    if (data.Items.length) {
                        oldOrderID = data.Items[0].ID;
                        _checkLineItems();
                    } else {
                        _transferOrder();
                    }
                    data.Items[0];
                });
        }

        function _checkLineItems() {
            ocLineItems.ListAll(oldOrderID)
                .then(function(lineItems){
                    transferLineItems = lineItems;
                    _transferOrder();
                });
        }

        function _transferOrder() {
            OrderCloudSDK.Me.TransferAnonUserOrder(anonymousToken)
                .then(function() {
                    if (transferLineItems.length) {
                        //add the line items from the users old unsubmitted order to the newly transferred order
                        _transferLineItems();
                    } else if (oldOrderID) {
                        //if no lineitems exist, delete the old unsubmitted order
                        _deleteOldOrder();
                    } else {
                        df.resolve();
                    }
                });
        }

        function _transferLineItems() {
            var queue = [];
            //decode the anonymous token to get the orderid that was transferred to the current user
            var newOrderID = JSON.parse(atob(anonymousToken.split('.')[1])).orderid;
            angular.forEach(transferLineItems, function(li) {
                queue.push((function() {
                    var defer = $q.defer();
                    OrderCloudSDK.LineItems.Create('outgoing', newOrderID, _.pick(li, 'ProductID', 'Quantity', 'Specs', 'DateAdded', 'xp'))
                        .then(function() {
                            defer.resolve();
                        })
                        .catch(function(ex) {
                            defer.resolve(ex);
                        });
                    return defer.promise;
                })());
            });
            $q.all(queue)
                .then(function() {
                    _deleteOldOrder();
                });
        }

        function _deleteOldOrder() {
            //delete the users old unsubmitted order
            OrderCloudSDK.Orders.Delete('outgoing', oldOrderID)
                .then(function() {
                    df.resolve();
                });
        }
        return df.promise;
    }

    return service;
}