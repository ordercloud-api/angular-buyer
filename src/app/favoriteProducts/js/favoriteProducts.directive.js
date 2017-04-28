angular.module('orderCloud')
    .directive('ordercloudFavoriteProduct', FavoriteProductDirective)
;

function FavoriteProductDirective(){
    return {
        scope: {
            currentUser: '=',
            product: '='
        },
        restrict: 'E',
        templateUrl: 'favoriteProducts/templates/ordercloud-favorite-product.html',
        controller: 'FavoriteProductCtrl',
        controllerAs: 'favoriteProduct'
    };
}