angular.module('orderCloud')
    .directive('ocFavoriteProduct', OrderCloudFavoriteProductDirective)
;

function OrderCloudFavoriteProductDirective($exceptionHandler, toastr, OrderCloudSDK){
    return {
        scope: {
            currentUser: '=',
            product: '=',
            favoriteClass: '@',
            nonFavoriteClass: '@'
        },
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.hasFavorites = false;
            scope.checkHasFavorites = checkHasFavorites;
            scope.checkHasFavorites();

            (scope.hasFavorites && scope.currentUser.xp.FavoriteProducts.indexOf(scope.product.ID) > -1)
                ? addFavoriteClass()
                : removeFavoriteClass();

            function checkHasFavorites(){
                if(scope.currentUser && scope.currentUser.xp && scope.currentUser.xp.FavoriteProducts){
                    scope.hasFavorites = true;
                }
                else{
                    if(scope.currentUser && scope.currentUser.xp){
                        scope.currentUser.xp.FavoriteProducts = [];
                    }else{
                        scope.currentUser.xp = {};
                        scope.currentUser.xp.FavoriteProducts = [];
                    }
                    return OrderCloudSDK.Me.Patch({xp: scope.currentUser.xp})
                        .then(function(){
                            scope.hasFavorites = true;
                        })
                        .catch(function(ex){
                            $exceptionHandler(ex);
                        });
                }
            }

            function addFavoriteClass() {
                element.removeClass(scope.nonFavoriteClass)
                element.addClass(scope.favoriteClass);
            }

            function removeFavoriteClass() {
                element.removeClass(scope.favoriteClass);
                element.addClass(scope.nonFavoriteClass);
            }

            element.bind('click', function() {
                if (scope.hasFavorites){
                    if (element.hasClass(scope.favoriteClass)){
                        removeProduct();
                    } else {
                        addProduct(scope.currentUser.xp.FavoriteProducts);
                    }
                } else {
                    addProduct([]);
                }
            });

            function addProduct(existingList){
                existingList.push(scope.product.ID);
                return OrderCloudSDK.Me.Patch({xp: {FavoriteProducts: existingList}})
                    .then(function(data){
                        addFavoriteClass();
                        scope.hasFavorites = data.xp && data.xp.FavoriteProducts;
                        toastr.success(scope.product.Name + ' was added to your favorite products.');
                    });
            }

            function removeProduct(){
                var updatedList = _.without(scope.currentUser.xp.FavoriteProducts, scope.product.ID);
                return OrderCloudSDK.Me.Patch({xp: {FavoriteProducts: updatedList}})
                    .then(function() {
                        removeFavoriteClass();
                        scope.currentUser.xp.FavoriteProducts = updatedList;
                        toastr.success(scope.product.Name + ' was removed from your favorite products.');
                    });
            }

            element.css('cursor', 'pointer');
        }
    };
}