angular.module('orderCloud')
    .controller('CategoryBrowseCtrl', CategoryBrowseController)
;

function CategoryBrowseController($state, OrderCloudSDK, ocParameters, CategoryList, ProductList, Parameters, SelectedCategory) {
    var vm = this;
    vm.categoryList = CategoryList;
    vm.productList = ProductList;
    vm.parameters = Parameters;
    if(!vm.parameters.filters) vm.parameters.filters = {};
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

    vm.changeProductPage = function(newPage){
        vm.parameters.productPage = newPage;
        vm.filter(false);
    };

    vm.loadMoreCategories = function() {
        //If you change behavior here, make sure you change behavior in resolve to match
        if(vm.parameters.categoryID) { 
            vm.parameters.filters.ParentID = vm.parameters.categoryID;
        } 
        vm.parameters.page = vm.categoryList.Meta.Page + 1;
        return OrderCloudSDK.Me.ListCategories(vm.parameters)
            .then(function(data){
                vm.categoryList.Items = vm.categoryList.Items.concat(data.Items);
                vm.categoryList.Meta = data.Meta;
            });
    };

    vm.loadMoreProducts = function() {
        //If you change behavior here, make sure you change behavior in resolve to match
        if(vm.parameters.filters.ParentID){
            delete vm.parameters.filters.ParentID;
        }
        vm.parameters.page = vm.productList.Meta.Page + 1;
        vm.parameters.depth = 'all';
        return OrderCloudSDK.Me.ListProducts(vm.parameters)
            .then(function(data) {
                vm.productList.Items = vm.productList.Items.concat(data.Items);
                vm.productList.Meta = data.Meta;
            });
    };
}