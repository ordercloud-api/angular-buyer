angular.module('orderCloud')
    .factory('ocOrderDetail', ocOrderDetailService)
;

function ocOrderDetailService($q, $exceptionHandler, OrderCloud){
    var service = {
        GetOrderDetails: _getOrderDetails
    };

    function _getOrderDetails(orderID){
        return OrderCloud.Orders.Get(orderID)
            .then(function(order){
                return getBuyerOrg(order);
            });

        function getBuyerOrg(order){
            return OrderCloud.Buyers.Get(order.FromCompanyID)
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