angular.module('orderCloud')
    .config(ProductBrowseConfig)
;

function ProductBrowseConfig($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('/browse', '/browse/products');
    $stateProvider
        .state('productBrowse', {
            abstract: true,
            parent: 'base',
            url: '/browse',
            templateUrl: 'productBrowse/templates/productBrowse.html',
            controller: 'ProductBrowseCtrl',
            controllerAs: 'productBrowse',
            data: {
                pageTitle: 'Browse Products'
            },
            resolve: {
                Parameters: function ($stateParams, ocParameters) {
                    return ocParameters.Get($stateParams);
                },
                CategoryList: function(OrderCloudSDK) {
                    var parameters = {
                        depth: 'all',
                        page: 1,
                        pageSize: 100
                    };
                    return OrderCloudSDK.Me.ListCategories(parameters);
                },
                CategoryTree: function(CategoryList) {
                    var result = [];
                    angular.forEach(_.where(CategoryList.Items, {ParentID: null}), function(node) {
                        result.push(getnode(node));
                    });
                    function getnode(node) {
                        var children = _.where(CategoryList.Items, {ParentID: node.ID});
                        if (children.length > 0) {
                            node.children = children;
                            angular.forEach(children, function(child) {
                                return getnode(child);
                            });
                        } else {
                            node.children = [];
                        }
                        return node;
                    }
                    return result;
                }
            }
        })
        .state('productBrowse.products', {
            url: '/products?search&categoryid&favorites&page&pageSize&searchOn&sortBy&filters&depth',
            params: {
                catalogid: undefined
            },
            templateUrl: 'productBrowse/templates/productView.html',
            controller: 'ProductViewCtrl',
            controllerAs: 'productView',
            resolve: {
                Parameters: function ($stateParams, ocParameters) {
                    return ocParameters.Get($stateParams);
                },
                ProductList: function(OrderCloudSDK, ocFavoriteProducts, Parameters, CurrentUser) {
                    if (Parameters.favorites) {
                        return ocFavoriteProducts.Get()
                            .then(function(favoriteProductIDs) {
                                Parameters.filters ? angular.extend(Parameters.filters, Parameters.filters, {ID:favoriteProductIDs.join('|')}) : Parameters.filters = {ID:favoriteProductIDs.join('|')};
                                return _mergeParameters();
                            });
                    } else if (Parameters.filters) {
                        delete Parameters.filters.ID;
                        return _mergeParameters();
                    }

                    function _mergeParameters() {
                        var parameters = angular.extend({catalogID: CurrentUser.Buyer.DefaultCatalogID, categoryID: Parameters.categoryid, depth: 'all'}, Parameters);
                        return OrderCloudSDK.Me.ListProducts(parameters);
                    }
                }
            }
        });
}