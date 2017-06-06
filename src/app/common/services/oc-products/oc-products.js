angular.module('orderCloud')
    .factory('ocProducts', OrderCloudProductsService)
;

function OrderCloudProductsService(OrderCloudSDK) {
    return {
        Related: _listRelatedProducts,
        Featured: _listFeaturedProducts
    };

    function _listRelatedProducts(relatedProductIDs, parameters){
        if(!relatedProductIDs) return null;
        parameters = angular.extend(parameters || {}, {filters: {ID: relatedProductIDs.join('|')}});
        return OrderCloudSDK.Me.ListProducts(parameters);
    }

    function _listFeaturedProducts(parameters) {
        parameters = angular.extend(parameters || {}, {filters: {'xp.Featured': true}});
        return OrderCloudSDK.Me.ListProducts(parameters);
    }
}