angular.module('ordercloud-current-order', [])

    .factory('CurrentOrder', CurrentOrderService)

;
//TODO: CurrentOrderService needs to be updated to NEW SDK / remove the need for ImpersonationService
function CurrentOrderService($q, appname, $localForage, OrderCloud) {
    var StorageName = appname + '.CurrentOrderID';
    return {
        Get: Get,
        GetID: GetID,
        Set: Set,
        Remove: Remove,
        GetLineItems: GetLineItems
    };

    function Get() {
        var dfd = $q.defer();
        GetID()
            .then(function(OrderID) {
                OrderCloud.Orders.Get(OrderID)
                    .then(function(order) {
                        dfd.resolve(order);
                    })
                    .catch(function() {
                        Remove();
                        dfd.reject();
                    });
            })
            .catch(function() {
                dfd.reject();
            });
        return dfd.promise;
    }

    function GetID() {
        var dfd = $q.defer();
        $localForage.getItem(StorageName)
            .then(function(orderID) {
                if (orderID)
                    dfd.resolve(orderID);
                else {
                    Remove();
                    dfd.reject();
                }
            })
            .catch(function() {
                dfd.reject();
            });
        return dfd.promise;
    }

    function Set(OrderID) {
        $localForage.setItem(StorageName, OrderID)
            .then(function(data) {
                return data;
            })
            .catch(function(error) {
                return error;
            });
    }

    function Remove() {
        return $localForage.removeItem(StorageName);
    }

    function GetLineItems(orderID) {
        var deferred = $q.defer();
        var lineItems = [];
        var queue = [];

        GetID()
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