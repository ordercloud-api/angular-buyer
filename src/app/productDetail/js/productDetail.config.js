angular.module('orderCloud')
    .config(ProductDetailConfig)
;

function ProductDetailConfig($stateProvider) {
    $stateProvider
        .state('productDetail', {
            parent: 'base',
            url: '/product/:productid',
            templateUrl: 'productDetail/templates/productDetail.html',
            controller: 'ProductDetailCtrl',
            controllerAs: 'productDetail',
            resolve: {
                Product: function ($stateParams, sdkOrderCloud, catalogid) {
                    return sdkOrderCloud.Me.GetProduct(catalogid, $stateParams.productid);
                }
            }
        });
}