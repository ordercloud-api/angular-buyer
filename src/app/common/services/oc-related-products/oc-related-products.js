angular.module('orderCloud')
    .factory('ocRelatedProducts', OrderCloudRelatedProductsService)
;

function OrderCloudRelatedProductsService(OrderCloudSDK) {
    return {
        List : _listRelatedProducts
    };

    function _listRelatedProducts(related){
        if(!related) return null;
        var parameters = {
            filters: {
                ID: related.join('|')
            }
        };
        return OrderCloudSDK.Me.ListProducts(parameters);
    }
}