angular.module('orderCloud')
    .config(FavoriteProductsConfig)
;

function FavoriteProductsConfig($stateProvider){
    $stateProvider
        .state('favoriteProducts', {
            parent: 'account',
            templateUrl: 'favoriteProducts/templates/favoriteProducts.html',
            url: '/favorite-products?search?page?pageSize?searchOn?sortBy?filters?depth',
            controller: 'FavoriteProductsCtrl',
            controllerAs: 'favoriteProducts',
            data: {
                pageTitle: 'Favorite Products'
            },
            resolve: {
                Parameters: function ($stateParams, ocParameters) {
                    return ocParameters.Get($stateParams);
                },
                FavoriteProducts: function(OrderCloudSDK, Parameters, CurrentUser){
                    if (CurrentUser.xp && CurrentUser.xp.FavoriteProducts.length) {
                        var parameters = angular.extend(Parameters, {pageSize: Parameters.pageSize || 6, filters: {ID: CurrentUser.xp.FavoriteProducts.join('|')}});
                        return OrderCloudSDK.Me.ListProducts(parameters);
                    } else {
                        return null;
                    }
                }
            }
        });
}