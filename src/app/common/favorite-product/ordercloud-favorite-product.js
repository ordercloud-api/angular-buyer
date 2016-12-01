angular.module('ordercloud-favorite-product', [])
    .directive('ordercloudFavoriteProduct', FavoriteProductDirective)
    .controller('FavoriteProductCtrl', FavoriteProductController)
;

function FavoriteProductDirective(){
    return {
        scope: {
            currentUser: '=',
            product: '='
        },
        restrict: 'E',
        templateUrl: 'common/favorite-product/templates/favorite-product.tpl.html',
        controller: 'FavoriteProductCtrl',
        controllerAs: 'favoriteProduct'
    };
}

function FavoriteProductController($scope, OrderCloud, Underscore, toastr, $state){
    var vm = this;
    var hasFavorites = $scope.currentUser.xp && $scope.currentUser.xp.FavoriteProducts;
    vm.isFavorited = hasFavorites && $scope.currentUser.xp.FavoriteProducts.indexOf($scope.product.ID) > -1;


    vm.toggleFavoriteProduct = function(){
        function addProduct(existingList){
            existingList.push($scope.product.ID);
            OrderCloud.Me.Patch({xp: {FavoriteProducts: existingList}})
                .then(function(){
                    vm.isFavorited = true;
                    toastr.success($scope.product.Name + ' was added to your favorites');
                });
        }
        function removeProduct(){
            var updatedList = Underscore.without($scope.currentUser.xp.FavoriteProducts, $scope.product.ID);
            OrderCloud.Me.Patch({xp: {FavoriteProducts: updatedList}})
                .then(function(){
                    vm.isFavorited = false;
                    $scope.currentUser.xp.FavoriteProducts = updatedList;
                    toastr.success($scope.product.Name + ' was removed from your favorites');
                });
        }
        if (hasFavorites){
            if (vm.isFavorited){
                removeProduct();
                console.log('Product Removed');
            } else {
                addProduct($scope.currentUser.xp.FavoriteProducts);
                console.log('Product Added');
            }

        } else {
            addProduct([]);
            console.log('Favorites array added');
        }
        
    };
    
}
