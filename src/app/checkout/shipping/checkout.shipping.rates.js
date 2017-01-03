angular.module('orderCloud')
    .factory('ShippingRates', ShippingRatesService)
;

function ShippingRatesService($q, $resource, OrderCloud, apiurl) {
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
            BuyerID: OrderCloud.BuyerID.Get(),
            TransactionType: 'GetRates',
            OrderID: order.ID
        };

        $resource(shippingRatesURL, {}, {getrates: {method: 'POST', headers: {'Authorization': 'Bearer ' + OrderCloud.Auth.ReadToken()}}}).getrates(request).$promise
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
            BuyerID: OrderCloud.BuyerID.Get(),
            TransactionType: 'GetLineItemRates',
            OrderID: order.ID
        };

        $resource(shippingRatesURL, {}, {getlineitemrates: {method: 'POST', headers: {'Authorization': 'Bearer ' + OrderCloud.Auth.ReadToken()}}}).getlineitemrates(request).$promise
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
            BuyerID: OrderCloud.BuyerID.Get(),
            TransactionType: 'SetShippingCost',
            OrderID: order.ID,
            ShippingCost: cost
        };

        $resource(shippingRatesURL, {}, {setshippingcost: {method: 'POST', headers: {'Authorization': 'Bearer ' + OrderCloud.Auth.ReadToken()}}}).setshippingcost(request).$promise
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

        OrderCloud.Orders.Patch(order.ID, {xp: xpPatch})
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
