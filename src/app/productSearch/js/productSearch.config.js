angular.module('orderCloud')
    .config(ProductSearchConfig)
;

function ProductSearchConfig($stateProvider) {
    $stateProvider
        .state('productSearchResults', {
            parent: 'base',
            url: '/productSearchResults/:searchTerm?page&pageSize&sortBy',
            templateUrl: 'productSearch/templates/productSearch.results.html',
            controller: 'ProductSearchCtrl',
            controllerAs: 'productSearch',
            resolve: {
                Parameters: function(ocParameters, $stateParams) {
                    return ocParameters.Get($stateParams);
                },
                ProductList: function(OrderCloudSDK, Parameters, catalogid) {
                    var parameters = angular.extend(Parameters, {catalogID: catalogid, depth: 'all', pageSize: (Parameters.pageSize || 12)});
                    return OrderCloudSDK.Me.ListProducts(parameters);
                }
            }
        });
}