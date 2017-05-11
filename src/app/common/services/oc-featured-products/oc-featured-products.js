angular.module('orderCloud')
    .factory('ocFeaturedProductsService', OrderCloudFeaturedProductsService)
;

function OrderCloudFeaturedProductsService(OrderCloudSDK) {
    return {
        List: _listFeaturedProducts
    };

    function _listFeaturedProducts() {
        return OrderCloudSDK.Me.ListProducts()
            .then(function(products) {
                var featuredProducts = [];
                var featured = _.each(products.Items, function(product) {
                    if(product.xp && product.xp.Featured) {
                        featuredProducts.push(product);
                    }
                });
                return featuredProducts;
            });
    }
}