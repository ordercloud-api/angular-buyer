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

function FavoriteProductController($scope, OrderCloud, toastr){
    var vm = this;

    vm.align = $scope.align;
    vm.product = $scope.product;

    //console.log('product scope', vm.product.Name);

    //grabs current user
    //vm.user = function(){
    //    return OrderCloud.Me.Get();
    //};
    //vm.currentUser = vm.user();

    vm.addFavoriteProduct = function(){
        OrderCloud.Me.Get()
            .then(function(){
                if(OrderCloud.Me.Get({xp: null})) {
                    console.log('user', OrderCloud.Me.Get());
                    OrderCloud.Me.Patch({xp: {FavoriteProducts: vm.product.ID}})
                        .then(function(){
                            toastr.success(vm.product.Name + ' was added to your favorites');
                        });
                } else if (OrderCloud.Me.Get({xp: {FavoriteProducts: []}})) {
                        //.then(function(){

                        //check existing xp values
                            //IF DUPLICATES
                                //return error for duplicates
                            //ELSE
                                //add new xp value
                                /*
                                 vm.addToFavorites = AddToFavorites;

                                 function AddToFavorites(){
                                 AddProduct($scope.product);
                                 }

                                 function AddProduct(product){
                                 var products = []
                                 products.push(OrderCloud.Me.Get({xp: {FavoriteProducts: product.ID}}));
                                 }
                                 */
                        //});
                }

            });
    };


    //vm.heartToggle = false;


    vm.removeFromFavorite = function(){

    };
}
