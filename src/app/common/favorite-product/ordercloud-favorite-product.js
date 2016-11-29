angular.module('ordercloud-favorite-product', [])
    .directive('ordercloudFavoriteProduct', FavoriteProductDirective)
    .controller('FavoriteProductCtrl', FavoriteProductController)
;

function FavoriteProductDirective(){
    return {
        scope: {
            align: '@',
            product: '='
        },
        restrict: 'E',
        templateUrl: 'common/favorite-product/templates/favorite-product.tpl.html',
        controller: 'FavoriteProductCtrl',
        controllerAs: 'favoriteProduct'
    };
}

function FavoriteProductController($scope, OrderCloud){
    var vm = this;

    vm.align = $scope.align;
    vm.product = $scope.product;

    //grabs current user
    vm.user = function(){
        return OrderCloud.Me.Get();
    };
    vm.currentUser = vm.user();

    vm.addFavoriteProduct = function(){
        OrderCloud.Me.Get()
            .then(function(){
                if(OrderCloud.Me.Get({xp: null})) {
                    OrderCloud.Me.Patch({xp: {FavoriteProducts: vm.product}});
                } else if (OrderCloud.Me.Get({xp: {FavoriteProducts: []}})) {
                    //OrderCloud.Me.Get({xp: {FavoriteProducts: []}});
                    console.log('user', OrderCloud.Me.Get())
                        .then(function(){

                        //check existing xp values
                            //IF DUPLICATES
                                //return error for duplicates
                            //ELSE
                                //add new xp value
                        });
                }

            });
    };


    //vm.heartToggle = false;


    vm.removeFromFavorite = function(){

    };
}
