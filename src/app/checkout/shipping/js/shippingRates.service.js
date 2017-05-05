angular.module('orderCloud')
    .factory('ocShippingRates', OrderCloudShippingRatesService)
;

function OrderCloudShippingRatesService($q, $resource, OrderCloudSDK, apiurl, buyerid) {
    var service = {
        GetRates: _getRates,
        GetLineItemRates: _getLineItemRates,
        SetShippingCost: _setShippingCost,
        ManageShipments: _manageShipments,
        AnalyzeShipments: _analyzeShipments
    };

    var shippingRatesURL = apiurl + '/v1/integrationproxy/shippingrates';

    function _getRates(order) {
        var deferred = $q.defer();

        var request = {
            BuyerID: buyerid,
            TransactionType: 'GetRates',
            OrderID: order.ID
        };

        $resource(shippingRatesURL, {}, {getrates: {method: 'POST', headers: {'Authorization': 'Bearer ' + OrderCloudSDK.GetToken()}}}).getrates(request).$promise
            .then(function(data) {
                deferred.resolve(data.ResponseBody.Shipments);
            })
            .catch(function(ex) {
                deferred.resolve(null);
            });

        return deferred.promise;
    }

    function _getLineItemRates(order) {
        var deferred = $q.defer();

        var request = {
            BuyerID: buyerid,
            TransactionType: 'GetLineItemRates',
            OrderID: order.ID
        };

        $resource(shippingRatesURL, {}, {getlineitemrates: {method: 'POST', headers: {'Authorization': 'Bearer ' + OrderCloudSDK.GetToken()}}}).getlineitemrates(request).$promise
            .then(function(data) {
                deferred.resolve(data.ResponseBody.Shipments);
            })
            .catch(function(ex) {
                deferred.resolve(null);
            });

        return deferred.promise;
    }

    function _setShippingCost(order, cost) {
        var deferred = $q.defer();

        var request = {
            BuyerID: buyerid,
            TransactionType: 'SetShippingCost',
            OrderID: order.ID,
            ShippingCost: cost
        };

        $resource(shippingRatesURL, {}, {setshippingcost: {method: 'POST', headers: {'Authorization': 'Bearer ' + OrderCloudSDK.GetToken()}}}).setshippingcost(request).$promise
            .then(function(data) {
                deferred.resolve(data.ResponseBody);
            })
            .catch(function(ex) {
                deferred.resolve(null);
            });

        return deferred.promise;
    }

    function _manageShipments(order, shipments) {
        var deferred = $q.defer();

        var xpPatch = {Shippers: []};
        var shippingCost = 0;

        angular.forEach(shipments, function(shipment) {
            if (shipment.SelectedShipper) {
                shippingCost += shipment.SelectedShipper.Price;
                xpPatch.Shippers.push({
                    Shipper: shipment.SelectedShipper.Description,
                    Cost: shipment.SelectedShipper.Price,
                    LineItemIDs: shipment.LineItemIDs
                });
            }
        });

        OrderCloudSDK.Orders.Patch('outgoing', order.ID, {xp: xpPatch})
            .then(function() {
                updateShippingCost();
            })
            .catch(function() {
                deferred.reject();
            });

         function updateShippingCost() {
             _setShippingCost(order, shippingCost)
                 .then(function(data) {
                     deferred.resolve(data);
                 })
                 .catch(function(ex) {
                     deferred.reject();
                 });
         }

        return deferred.promise;
    }

    function _analyzeShipments(order, shippingRates) {
        if (order.xp && order.xp.Shippers) {
            angular.forEach(order.xp.Shippers, function(shipment) {
                angular.forEach(shippingRates, function(s) {
                    if (_.intersection(s.LineItemIDs, shipment.LineItemIDs).length == shipment.LineItemIDs.length) {
                        var selection = _.findWhere(s.Rates, {Description: shipment.Shipper});
                        if (selection) s.SelectedShipper = selection;
                    }
                });
            });
        }

        return shippingRates;
    }

    return service;
}
