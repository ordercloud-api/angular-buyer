angular.module('orderCloud')
    .directive('ocFavoriteProduct', OrderCloudFavoriteProductDirective)
;

function OrderCloudFavoriteProductDirective($exceptionHandler, toastr, ocFavoriteProducts){
    return {
        scope: {
            product: '=',
            favoriteClass: '@',
            nonFavoriteClass: '@'
        },
        restrict: 'A',
        link: function(scope, element, attrs) {
            removeFavoriteClass();
            ocFavoriteProducts.Init(scope.product.ID)
                .then(function(isFavorite) {
                    if (isFavorite) {
                        addFavoriteClass();
                    } else {
                        removeFavoriteClass();
                    }
                });

            element.css('cursor', 'pointer');

            function addFavoriteClass() {
                element.removeClass(scope.nonFavoriteClass);
                element.addClass(scope.favoriteClass);
            }

            function removeFavoriteClass() {
                element.removeClass(scope.favoriteClass);
                element.addClass(scope.nonFavoriteClass);
            }

            element.on('click', function() {
                ocFavoriteProducts.Toggle(scope.product.ID)
                    .then(function(wasAdded) {
                        if (wasAdded) {
                            addFavoriteClass();
                            toastr.success(scope.product.Name + ' was added to your favorite products.');
                        } else {
                            removeFavoriteClass();
                            toastr.success(scope.product.Name + ' was removed from your favorite products.');
                        }
                    })
                    .catch(function(ex) {
                        $exceptionHandler(ex);
                    });
            });

            scope.$on('$destroy', function(){
                //prevent memory leak
                element.off('click');
            });
        }
    };
}