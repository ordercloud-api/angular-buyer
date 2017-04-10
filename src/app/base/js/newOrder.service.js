angular.module('orderCloud')
    .factory('ocNewOrder', OrderCloudNewOrderService)
;

function OrderCloudNewOrderService($q, OrderCloudSDK) {
    var service = {
        Create: _create
    };

    function _create() {
        var deferred = $q.defer();
        var order = {};

        //ShippingAddressID
        var options = {
            page: 1,
            pageSize: 100,
            filters: {Shipping: true}
        };
        OrderCloudSDK.Me.ListAddresses(options)
            .then(function(shippingAddresses) {
                if (shippingAddresses.Items.length) order.ShippingAddressID = shippingAddresses.Items[0].ID;
                setBillingAddress();
            });

        //BillingAddressID
        function setBillingAddress() {
            var options = {
                page: 1,
                pageSize: 100,
                filters: {Billing: true}
            };
            OrderCloudSDK.Me.ListAddresses(options)
                .then(function(billingAddresses) {
                    if (billingAddresses.Items.length) order.BillingAddressID = billingAddresses.Items[0].ID;
                    createOrder();
                });
        }

        function createOrder() {
            OrderCloudSDK.Orders.Create('outgoing', order)
                .then(function(order) {
                    deferred.resolve(order);
                });
        }

        return deferred.promise;
    }

    return service;
}