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
                Product: function ($stateParams, OrderCloudSDK, catalogid) {
                    return OrderCloudSDK.Me.GetProduct(catalogid, $stateParams.productid);
                }
            }
        });
}