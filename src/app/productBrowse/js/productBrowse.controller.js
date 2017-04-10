angular.module('orderCloud')
    .controller('ProductBrowseCtrl', ProductBrowseController)
;

function ProductBrowseController($state, ocProductBrowse, CategoryList, CategoryTree, Parameters) {
    var vm = this;
    vm.parameters = Parameters;
    vm.categoryList = CategoryList;

    //Category Tree Setup
    vm.treeConfig = {};

    vm.treeConfig.treeData = CategoryTree;
    vm.treeConfig.treeOptions = {
        equality: function(node1, node2) {
            if (node2 && node1) {
                return node1.ID === node2.ID;
            } else {
                return node1 === node2;
            }
        }
    };

    vm.treeConfig.selectNode = function(node) {
        $state.go('productBrowse.products', {categoryid:node.ID, page:''});
    };

    //Initiate breadcrumbs is triggered by product list view (child state "productBrowse.products")
    vm.treeConfig.initBreadcrumbs = function(activeCategoryID, ignoreSetNode) {
        if (!ignoreSetNode) { //first iteration of initBreadcrumbs(), initiate breadcrumb array, set selected node for tree
            vm.treeConfig.selectedNode = {ID:activeCategoryID};
            vm.breadcrumb = [];
        }
        if (!activeCategoryID) { //at the catalog root, no expanded nodes
            vm.treeConfig.expandedNodes = angular.copy(vm.breadcrumb);
        } else {
            var activeCategory = _.findWhere(vm.categoryList.Items, {ID: activeCategoryID});
            if (activeCategory) {
                vm.breadcrumb.unshift(activeCategory);
                if (activeCategory.ParentID) {
                    vm.treeConfig.initBreadcrumbs(activeCategory.ParentID, true);
                } else { //last iteration, set tree expanded nodes to the breadcrumb
                    vm.treeConfig.expandedNodes = angular.copy(vm.breadcrumb);
                }
            }
        }
    };

    vm.toggleFavorites = function() {
        if (vm.parameters.filters && vm.parameters.filters.ID) delete vm.parameters.filters.ID;
        if (vm.parameters.favorites) {
            vm.parameters.favorites = '';
        } else {
            vm.parameters.favorites = true;
            vm.parameters.page = '';
        }
        $state.go('productBrowse.products', vm.parameters);
    };

    vm.openCategoryModal = function(){
        ocProductBrowse.OpenCategoryModal(vm.treeConfig)
            .then(function(node){
                $state.go('productBrowse.products', {categoryid:node.ID, page:''});
            });
    };
}