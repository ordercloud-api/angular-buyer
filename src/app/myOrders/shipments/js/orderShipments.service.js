angular.module('orderCloud')
    .factory('ocOrderShipments', OrderCloudOrderShipmentsService)
;

function OrderCloudOrderShipmentsService($q, OrderCloudSDK) {
    var service = {
        List: _list
    };

    function _list(orderID, page, pageSize) {
        var df = $q.defer();

        var options = {
            orderID: orderID,
            page: page,
            pageSize: pageSize
        };
        OrderCloudSDK.Me.ListShipments(options)
            .then(function(data) {
                df.resolve(data);
                //TODO: Add this back if Shopper is able to list shipment items
                //getShipmentItems(data);
            });

        function getShipmentItems(data) {
            var queue = [];

            angular.forEach(data.Items, function(shipment) {
                queue.push((function() {
                    var d = $q.defer();

                    OrderCloudSDK.Shipments.ListItems(shipment.ID)
                        .then(function(shipmentItems) {
                            shipment.Items = shipmentItems.Items;
                            d.resolve();
                        });

                    return d.promise;
                })());
            });

            $q.all(queue).then(function() {
                getLineItems(data);
            });
        }

        function getLineItems(data) {
            var lineItemIDs = _.uniq(_.flatten(_.map(data.Items, function(shipment) { return _.pluck(shipment.Items, 'LineItemID');})));
            var options = {
                page: 1,
                pageSize: 100,
                filters: {ID: lineItemIDs.join('|')}
            };
            OrderCloudSDK.LineItems.List('incoming', orderID, options)
                .then(function(lineItemData) {
                    angular.forEach(data.Items, function(shipment) {
                        angular.forEach(shipment.Items, function(shipmentItem) {
                            shipmentItem.LineItem = _.findWhere(lineItemData.Items, {ID: shipmentItem.LineItemID});
                        });
                    });

                    analyzeShippingAddresses(data);
                });
        }

        function analyzeShippingAddresses(data) {
            angular.forEach(data.Items, function(shipment) {
                var shippingAddressCount = _.uniq(_.map(shipment.Items, function(item) { return (item.LineItem.ShippingAddress ? (item.LineItem.ShippingAddress.ID ? item.LineItem.ShippingAddress.ID : item.LineItem.ShippingAddress.Street1) : item.LineItem.ShippingAddressID); })).length;
                shipment.ShippingAddress = (shippingAddressCount == 1) ? shipment.Items[0].LineItem.ShippingAddress : null;
            });

            df.resolve(data);
        }

        return df.promise;
    }

    return service;
}