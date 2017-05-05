angular.module('orderCloud')
    .controller('FavoriteProductCtrl', FavoriteProductController)
;

function FavoriteProductController($scope, OrderCloudSDK, toastr){
    var vm = this;
    vm.checkHasFavorites = checkHasFavorites;
    vm.toggleFavoriteProduct = toggleFavoriteProduct;
    vm.addProduct = addProduct;
    vm.removeProduct = removeProduct;

    vm.checkHasFavorites();
    vm.isFavorited = vm.hasFavorites && $scope.currentUser.xp.FavoriteProducts.indexOf($scope.product.ID) > -1;

    function toggleFavoriteProduct(){
        if (vm.hasFavorites){
            if (vm.isFavorited){
                removeProduct();
            } else {
                addProduct($scope.currentUser.xp.FavoriteProducts);
            }
        } else {
            addProduct([]);
        }
    }

    function checkHasFavorites(){
        if($scope.currentUser && $scope.currentUser.xp && $scope.currentUser.xp.FavoriteProducts){
            vm.hasFavorites = true;
        }
        else{
            if($scope.currentUser && $scope.currentUser.xp){
                $scope.currentUser.xp.FavoriteProducts = [];
            }else{
                $scope.currentUser.xp ={};
                $scope.currentUser.xp.FavoriteProducts = [];
            }
            OrderCloudSDK.Me.Patch({xp:$scope.currentUser.xp})
                .then(function(){
                    vm.hasFavorites = true;
                })
                .catch(function(ex){
                    console.log(ex);
                });
        }
    }

    function addProduct(existingList){
        existingList.push($scope.product.ID);
        OrderCloudSDK.Me.Patch({xp: {FavoriteProducts: existingList}})
            .then(function(data){
                vm.hasFavorites = data.xp && data.xp.FavoriteProducts;
                vm.isFavorited = true;
                toastr.success($scope.product.Name + ' was added to your favorite products.');
            });
    }

    function removeProduct(){
        var updatedList = _.without($scope.currentUser.xp.FavoriteProducts, $scope.product.ID);
        OrderCloudSDK.Me.Patch({xp: {FavoriteProducts: updatedList}})
            .then(function(){
                vm.isFavorited = false;
                $scope.currentUser.xp.FavoriteProducts = updatedList;
                toastr.success($scope.product.Name + ' was removed from your favorite products.');
            });
    }

}