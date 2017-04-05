angular.module('orderCloud')
    .factory('ocOrderDetails', ocOrderDetailsService)
;

function ocOrderDetailsService($q, $exceptionHandler, sdkOrderCloud){
    var service = {
        Get: _get
    };

    function _get(orderID){
        return sdkOrderCloud.Orders.Get('outgoing', orderID)
            .then(function(order){
                return getBuyerOrg(order);
            });

        function getBuyerOrg(order){
            return sdkOrderCloud.Buyers.Get(order.FromCompanyID)
                .then(function(buyer){
                    order.FromCompany = buyer;
                    return order;
                })
                .catch(function(ex){
                    $exceptionHandler(ex);
                    return order;
                });
        }
    }

    return service;
}