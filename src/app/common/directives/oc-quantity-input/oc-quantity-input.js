angular.module('orderCloud')
    .directive('ocQuantityInput', OCQuantityInput)
;

function OCQuantityInput($log, $rootScope, toastr, OrderCloudSDK) {
    return {
        scope: {
            product: '=',
            lineitem: '=',
            label: '@',
            order: '=',
            onUpdate: '&'
        },
        templateUrl: 'common/directives/oc-quantity-input/oc-quantity-input.html',
        replace: true,
        link: function (scope) {
            if (scope.product) {
                scope.item = scope.product;
                scope.content = 'product';
            } else if (scope.lineitem) {
                scope.item = scope.lineitem;
                scope.content = 'lineitem';
                scope.updateQuantity = function () {
                    if (scope.item.Quantity > 0) {
                        OrderCloudSDK.LineItems.Patch('outgoing', scope.order.ID, scope.item.ID, {
                                Quantity: scope.item.Quantity
                            })
                            .then(function (data) {
                                data.Product = scope.lineitem.Product;
                                scope.item = data;
                                scope.lineitem = data;
                                if (typeof scope.onUpdate === 'function') scope.onUpdate(scope.lineitem);
                                toastr.success(data.Product.Name + ' quantity updated to ' + data.Quantity);
                                $rootScope.$broadcast('OC:UpdateOrder', scope.order.ID, 'Calculating Order Total');
                            });
                    }
                };
            } else {
                $log.error('oc-quantity-input error: ocQuantityInput requires either a product or lineitem attribute in order to work properly.');
            }
        }
    };
}