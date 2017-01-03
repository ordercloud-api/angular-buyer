angular.module('orderCloud')
    .config(CategoryBrowseConfig)
    .controller('CategoryBrowseCtrl', CategoryBrowseController)
;

function CategoryBrowseConfig($stateProvider, catalogid){
    $stateProvider
        .state('categoryBrowse', {
            parent:'base',
            url:'/browse/categories?categoryID?productPage?categoryPage?pageSize?sortBy?filters',
            templateUrl:'categoryBrowse/templates/categoryBrowse.tpl.html',
            controller:'CategoryBrowseCtrl',
            controllerAs:'categoryBrowse',
            resolve: {
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                CategoryList: function(OrderCloud, Parameters) {
                    if(Parameters.categoryID) { Parameters.filters ? Parameters.filters.ParentID = Parameters.categoryID : Parameters.filters = {ParentID:Parameters.categoryID}; } 
                    return OrderCloud.Me.ListCategories(null, Parameters.categoryPage, Parameters.pageSize || 12, null, Parameters.sortBy, Parameters.filters, 1);
                },
                ProductList: function(OrderCloud, Parameters) {
                    if(Parameters && Parameters.filters && Parameters.filters.ParentID) {
                        delete Parameters.filters.ParentID;
                        return OrderCloud.Me.ListProducts(null, Parameters.productPage, Parameters.pageSize || 12, null, Parameters.sortBy, Parameters.filters, Parameters.categoryID);
                    } else {
                        return null;
                    }
                },
                SelectedCategory: function(OrderCloud, Parameters){
                    if(Parameters.categoryID){
                        return OrderCloud.Me.ListCategories(null, 1, 1, null, null, {ID:Parameters.categoryID}, 'all')
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

function CategoryBrowseController($state, OrderCloudParameters, CategoryList, ProductList, Parameters, SelectedCategory) {
    var vm = this;
    vm.categoryList = CategoryList;
    vm.productList = ProductList;
    vm.parameters = Parameters;
    vm.selectedCategory = SelectedCategory;

    vm.getNumberOfResults = function(list){
        return vm[list].Meta.ItemRange[0] + ' - ' + vm[list].Meta.ItemRange[1] + ' of ' + vm[list].Meta.TotalCount + ' results';
    };

    vm.filter = function(resetPage) {
        $state.go('.', OrderCloudParameters.Create(vm.parameters, resetPage));
    };

    vm.updateCategoryList = function(category){
        vm.parameters.categoryID = category;
        vm.filter(true);
    };

    vm.changeCategoryPage = function(newPage){
        vm.parameters.categoryPage = newPage;
        vm.filter(false);
    };
    
    vm.changeProductPage = function(newPage){
        vm.parameters.productPage = newPage;
        vm.filter(false);
    };
}
