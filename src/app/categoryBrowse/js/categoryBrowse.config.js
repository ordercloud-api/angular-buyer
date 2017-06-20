angular.module('orderCloud')
    .config(CategoryBrowseConfig)
;

function CategoryBrowseConfig($stateProvider){
    $stateProvider
        .state('categoryBrowse', {
            parent:'base',
            url:'/browse/categories?categoryID&productPage&categoryPage&pageSize&sortBy&filters',
            templateUrl:'categoryBrowse/templates/categoryBrowse.html',
            controller:'CategoryBrowseCtrl',
            controllerAs:'categoryBrowse',
            resolve: {
                Parameters: function($stateParams, ocParameters) {
                    return ocParameters.Get($stateParams);
                },
                CategoryList: function(OrderCloudSDK, Parameters) {
                    //If you change behavior here, make sure you change behavior in controller (loadMoreCategories) to match
                    if(Parameters.categoryID) { Parameters.filters ? Parameters.filters.ParentID = Parameters.categoryID : Parameters.filters = {ParentID:Parameters.categoryID}; } 
                    var parameters = angular.extend(Parameters, {depth: 1, page: (Parameters.categoryPage || Parameters.page), pageSize: (Parameters.pageSize || 12)});
                    return OrderCloudSDK.Me.ListCategories(parameters);
                },
                ProductList: function(OrderCloudSDK, Parameters) {
                    //If you change behavior here, make sure you change behavior in controller (loadMoreProducts) to match
                    if(Parameters && Parameters.filters && Parameters.filters.ParentID) {
                        delete Parameters.filters.ParentID;
                        var parameters = angular.extend(Parameters, {depth: 'all', page: (Parameters.productPage || Parameters.page), pageSize: (Parameters.pageSize || 12)});
                        return OrderCloudSDK.Me.ListProducts(parameters);
                    } else {
                        return null;
                    }
                },
                SelectedCategory: function(OrderCloudSDK, Parameters){
                    if(Parameters.categoryID){
                        var parameters = {
                            page: 1,
                            pageSize: 1,
                            depth: 'all',
                            filters: {ID: Parameters.categoryID}
                        };
                        return OrderCloudSDK.Me.ListCategories(parameters)
                            .then(function(data){
                                return data.Items[0];
                            });
                        
                    } else {
                        return null;
                    }
                    
                }
            }
        });
}