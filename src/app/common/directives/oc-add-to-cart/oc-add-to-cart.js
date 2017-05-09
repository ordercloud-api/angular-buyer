angular.module('orderCloud')
    .directive('ocAddToCart', ocAddToCartDirective);

function ocAddToCartDirective(toastr, OrderCloudSDK, $rootScope, $q, $exceptionHandler) {
    return {
        scope: {
            product: '=',
            order: '='
        },
        templateUrl: 'common/directives/oc-add-to-cart/oc-add-to-cart.html',
        replace: true,
        link: function(scope, element) {
            if (scope.product && scope.order) {
                scope.product.Quantity = 1;
            } else {
                $exceptionHandler({message: 'oc-add-to-cart directive is missing a required attribute'});
            }

            scope.addToCart = function() {
                var li = {
                    ProductID: scope.product.ID,
                    Quantity: 1
                };
                return OrderCloudSDK.LineItems.Create('Outgoing', scope.order.ID, li)
                    .then(function(newLI) {
                        scope.product.Quantity = newLI.Quantity;
                        $rootScope.$broadcast('OC:UpdateOrder', scope.order.ID);
                        toastr.success(scope.product.Name + ' added to cart', 'Success!');
                    })
                    .catch(function(ex) {
                        return $exceptionHandler(ex);
                    });
            };
        }
    };
}