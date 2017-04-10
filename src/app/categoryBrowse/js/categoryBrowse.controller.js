angular.module('orderCloud')
    .controller('CategoryBrowseCtrl', CategoryBrowseController)
;

function CategoryBrowseController($state, OrderCloudSDK, ocParameters, CategoryList, ProductList, Parameters, SelectedCategory) {
    var vm = this;
    vm.categoryList = CategoryList;
    vm.productList = ProductList;
    vm.parameters = Parameters;
    vm.selectedCategory = SelectedCategory;

    vm.getNumberOfResults = function(list){
        return vm[list].Meta.ItemRange[0] + ' - ' + vm[list].Meta.ItemRange[1] + ' of ' + vm[list].Meta.TotalCount + ' results';
    };

    vm.filter = function(resetPage) {
        $state.go('.', ocParameters.Create(vm.parameters, resetPage));
    };

    vm.updateCategoryList = function(category){
        vm.parameters.categoryID = category;
        vm.filter(true);
    };

    vm.changeCategoryPage = function(newPage){
        vm.parameters.categoryPage = newPage;
        vm.filter(false);
    };

    vm.loadMoreCategories = function() {
        var parameters = angular.extend(Parameters, {page:vm.categoryList.Meta.Page + 1});
        return OrderCloudSDK.Me.ListCategories(parameters)
            .then(function(data) {
                vm.categoryList.Items = vm.categoryList.Items.concat(data.Items);
                vm.categoryList.Meta = data.Meta;
            });
    };
    
    vm.changeProductPage = function(newPage){
        vm.parameters.productPage = newPage;
        vm.filter(false);
    };

    vm.loadMoreProducts = function() {
        var parameters = angular.extend(Parameters, {page:vm.productList.Meta.Page + 1});
        return OrderCloudSDK.Me.ListProducts(parameters)
            .then(function(data) {
                vm.productList.Items = vm.productList.Items.concat(data.Items);
                vm.productList.Meta = data.Meta;
            });
    };
}