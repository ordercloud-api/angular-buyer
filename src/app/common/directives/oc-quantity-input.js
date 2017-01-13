angular.module('orderCloud')
    .directive('ocQuantityInput', OCQuantityInput)

;

function OCQuantityInput(toastr, OrderCloud, $rootScope) {
    return {
        scope: {
            product: '=',
            lineitem: '=',
            label: '@',
            order: '=',
            onUpdate: '&'
        },
        templateUrl: 'common/templates/quantityInput.tpl.html',
        replace: true,
        link: function (scope) {
            if (scope.product){
                scope.item = scope.product;
                scope.content = "product"
            }
            else if(scope.lineitem){
                scope.item = scope.lineitem;
                scope.content = "lineitem";
                scope.updateQuantity = function() {
                    if (scope.item.Quantity > 0) {
                        OrderCloud.LineItems.Patch(scope.order.ID, scope.item.ID, {Quantity: scope.item.Quantity})
                            .then(function (data) {
                                data.Product = scope.lineitem.Product;
                                scope.item = data;
                                scope.lineitem = data;
                                if (typeof scope.onUpdate === "function") scope.onUpdate(scope.lineitem);
                                toastr.success('Quantity Updated');
                                $rootScope.$broadcast('OC:UpdateOrder', scope.order.ID, 'Calculating Order Total');
                            });
                    }
                }
            }
            else{
                toastr.error('Please input either a product or lineitem attribute in the directive','Error');
                console.error('Please input either a product or lineitem attribute in the quantityInput directive ')
            }
        }
    }
}
