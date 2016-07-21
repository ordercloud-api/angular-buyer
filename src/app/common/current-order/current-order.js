angular.module('ordercloud-current-order', [])
    .factory('CurrentOrder', CurrentOrderService)
;

function CurrentOrderService($q, $localForage, OrderCloud, appname) {
    var StorageName = appname + '.CurrentOrderID';
    return {
        Get: _get,
        GetID: _getID,
        Set: _set,
        Remove: _remove,
        GetLineItems: _getLineItems
    };

    function _get() {
        var dfd = $q.defer();
        _getID()
            .then(function(OrderID) {
                OrderCloud.Orders.Get(OrderID)
                    .then(function(order) {
                        dfd.resolve(order);
                    })
                    .catch(function() {
                        _remove();
                        dfd.reject();
                    });
            })
            .catch(function() {
                dfd.reject();
            });
        return dfd.promise;
    }

    function _getID() {
        var dfd = $q.defer();
        $localForage.getItem(StorageName)
            .then(function(orderID) {
                if (orderID)
                    dfd.resolve(orderID);
                else {
                    _remove();
                    dfd.reject();
                }
            })
            .catch(function() {
                dfd.reject();
            });
        return dfd.promise;
    }

    function _set(OrderID) {
        $localForage.setItem(StorageName, OrderID)
            .then(function(data) {
                return data;
            })
            .catch(function(error) {
                return error;
            });
    }

    function _remove() {
        return $localForage.removeItem(StorageName);
    }

    function _getLineItems(orderID) {
        var deferred = $q.defer();
        var lineItems = [];
        var queue = [];

        _getID()
            .then(function(OrderID) {
                OrderCloud.LineItems.List(OrderID, 1, 100)
                    .then(function(data) {
                        lineItems = lineItems.concat(data.Items);
                        for (var i = 2; i <= data.Meta.TotalPages; i++) {
                            queue.push(OrderCloud.LineItems.List(OrderID, i, 100));
                        }
                        $q.all(queue).then(function(results) {
                            angular.forEach(results, function(result) {
                                lineItems = lineItems.concat(result.Items);
                            });
                            deferred.resolve(lineItems);
                        });
                    });
            });

        return deferred.promise;
    }
}