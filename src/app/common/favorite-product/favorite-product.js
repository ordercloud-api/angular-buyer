angular.module('ordercloud-favorite-product', [])
    .directive('ordercloudFavoriteProduct', FavoriteProductDirective)
    .controller('FavoriteProductCtrl', FavoriteProductController)
;

function FavoriteProductDirective(){
    return {
        scope: {
            align: '@'
        },
        restrict: 'E',
        templateUrl: 'common/favorite-product/templates/favorite-product.tpl.html',
        controller: 'FavoriteProductCtrl',
        controllerAs: 'favoriteProduct'
    };
}

function FavoriteProductController($scope){
    var vm = this;

    vm.align = $scope.align;

    vm.addToFavorite = function(){

    };

    vm.removeFromFavorite = function(){
        
    };
}