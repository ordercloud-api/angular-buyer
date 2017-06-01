angular.module('orderCloud')
    .factory('ocFeaturedProductsService', OrderCloudFeaturedProductsService)
;

function OrderCloudFeaturedProductsService(OrderCloudSDK) {
    return {
        List: _listFeaturedProducts
    };

    function _listFeaturedProducts() {
        var parameters = {
            filters: {
                'xp.Featured': true
            }
        }
        return OrderCloudSDK.Me.ListProducts(parameters);
    }
}