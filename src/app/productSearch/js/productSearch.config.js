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
                ProductList: function(sdkOrderCloud, Parameters, catalogid) {
                    var parameters = angular.extend(Parameters, {catalogID: catalogid, pageSize: (Parameters.pageSize || 12)});
                    return sdkOrderCloud.Me.ListProducts(parameters);
                }
            }
        });
}