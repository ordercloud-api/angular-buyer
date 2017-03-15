angular.module('orderCloud')
    .config(FavoriteProductsConfig)
    .directive('ordercloudFavoriteProduct', FavoriteProductDirective)
    .controller('FavoriteProductsCtrl', FavoriteProductsController)
    .controller('FavoriteProductCtrl', FavoriteProductController)
;

function FavoriteProductsConfig($stateProvider){
    $stateProvider
        .state('favoriteProducts', {
            parent: 'account',
            templateUrl: 'favoriteProducts/templates/favoriteProducts.tpl.html',
            url: '/favorite-products?search?page?pageSize?searchOn?sortBy?filters?depth',
            controller: 'FavoriteProductsCtrl',
            controllerAs: 'favoriteProducts',
            data: {
                pageTitle: "Favorite Products"
            },
            resolve: {
                Parameters: function ($stateParams, ocParameters) {
                    return ocParameters.Get($stateParams);
                },
                FavoriteProducts: function(OrderCloud, Parameters, CurrentUser){
                    if (CurrentUser.xp && CurrentUser.xp.FavoriteProducts.length) {
                        return OrderCloud.Me.ListProducts(Parameters.search, Parameters.page, Parameters.pageSize || 6, Parameters.searchOn, Parameters.sortBy, {ID: CurrentUser.xp.FavoriteProducts.join('|')});
                    } else {
                        return null;
                    }
                }
            }
        });
}

function FavoriteProductsController(ocParameters, OrderCloud, $state, $ocMedia, Parameters, CurrentUser, FavoriteProducts){
    var vm = this;
    vm.currentUser = CurrentUser;
    vm.list = FavoriteProducts;
    vm.parameters = Parameters;

    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') == 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;

    //Filtering and Search Functionality
    //check if filters are applied
    vm.filtersApplied = vm.parameters.filters || ($ocMedia('max-width: 767px') && vm.sortSelection);
    vm.showFilters = vm.filtersApplied;


    //reload the state with new filters
    vm.filter = function(resetPage) {
        $state.go('.', ocParameters.Create(vm.parameters, resetPage));
    };

    //clear the relevant filters, reload the state & reset the page
    vm.clearFilters = function() {
        vm.parameters.filters = null;
        $ocMedia('max-width: 767px') ? vm.parameters.sortBy = null : angular.noop();
        vm.filter(true);
    };

    vm.updateSort = function(value) {
        value ? angular.noop() : value = vm.sortSelection;
        switch (vm.parameters.sortBy) {
            case value:
                vm.parameters.sortBy = '!' + value;
                break;
            case '!' + value:
                vm.parameters.sortBy = null;
                break;
            default:
                vm.parameters.sortBy = value;
        }
        vm.filter(false);
    };

    vm.reverseSort = function() {
        Parameters.sortBy.indexOf('!') == 0 ? vm.parameters.sortBy = Parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    };

    //reload the state with the incremented page parameter
    vm.pageChanged = function() {
        $state.go('.', {
            page: vm.list.Meta.Page
        });
    };

    //load the next page of results with all the same parameters
    vm.loadMore = function() {
        return OrderCloud.Me.ListProducts(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };
}

function FavoriteProductDirective(){
    return {
        scope: {
            currentUser: '=',
            product: '='
        },
        restrict: 'E',
        templateUrl: 'favoriteProducts/templates/ordercloud-favorite-product.tpl.html',
        controller: 'FavoriteProductCtrl',
        controllerAs: 'favoriteProduct'
    };
}

function FavoriteProductController($scope, OrderCloud, toastr){
    var vm = this;
    vm.hasFavorites = $scope.currentUser && $scope.currentUser.xp && $scope.currentUser.xp.FavoriteProducts;
    vm.isFavorited = vm.hasFavorites && $scope.currentUser.xp.FavoriteProducts.indexOf($scope.product.ID) > -1;

    vm.toggleFavoriteProduct = function(){
        if (vm.hasFavorites){
            if (vm.isFavorited){
                removeProduct();
            } else {
                addProduct($scope.currentUser.xp.FavoriteProducts);
            }

        } else {
            addProduct([]);
        }
        function addProduct(existingList){
            existingList.push($scope.product.ID);
            OrderCloud.Me.Patch({xp: {FavoriteProducts: existingList}})
                .then(function(data){
                    vm.hasFavorites = data.xp && data.xp.FavoriteProducts;
                    vm.isFavorited = true;
                    toastr.success($scope.product.Name + ' was added to your favorites');
                });
        }
        function removeProduct(){
            var updatedList = _.without($scope.currentUser.xp.FavoriteProducts, $scope.product.ID);
            OrderCloud.Me.Patch({xp: {FavoriteProducts: updatedList}})
                .then(function(){
                    vm.isFavorited = false;
                    $scope.currentUser.xp.FavoriteProducts = updatedList;
                    toastr.success($scope.product.Name + ' was removed from your favorites');
                });
        }
    };
}

