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
                CategoryList: function(OrderCloudSDK, catalogid) {
                    var parameters = {
                        depth: 'all',
                        catalogID: catalogid,
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
            url: '/products?categoryid?favorites?search?page?pageSize?searchOn?sortBy?filters?depth',
            templateUrl: 'productBrowse/templates/productView.html',
            controller: 'ProductViewCtrl',
            controllerAs: 'productView',
            resolve: {
                Parameters: function ($stateParams, ocParameters) {
                    return ocParameters.Get($stateParams);
                },
                ProductList: function(OrderCloudSDK, CurrentUser, Parameters, catalogid) {
                    if (Parameters.favorites && CurrentUser.xp.FavoriteProducts) {
                        Parameters.filters ? angular.extend(Parameters.filters, Parameters.filters, {ID:CurrentUser.xp.FavoriteProducts.join('|')}) : Parameters.filters = {ID:CurrentUser.xp.FavoriteProducts.join('|')};
                    } else if (Parameters.filters) {
                        delete Parameters.filters.ID;
                    }
                    var parameters = angular.extend(Parameters, {catalogID: catalogid, categoryID: Parameters.categoryid, depth: 'all'});
                    return OrderCloudSDK.Me.ListProducts(parameters);
                }
            }
        });
}