angular.module('orderCloud')
    .directive('ocQuantityInput', OCQuantityInput)

;

function OCQuantityInput(toastr) {
    return {
        scope: {
            product: '=',
            lineitem: '=',
            label: '@',
            order: '=',
            updateFn: '='
        },
        templateUrl: 'productDetail/quantityInput/templates/quantityInput.tpl.html',
        replace: true,
        link: function (scope) {
            if (scope.product){
                scope.item = scope.product;
                scope.content = "product"
            }
            else if(scope.lineitem){
                scope.item = scope.lineitem;
                scope.content = "lineitem"
            }
            else{
                toastr.error('Please input either a product or lineitem attribute in the directive','Error');
                console.error('Please input either a product or lineitem attribute in the quantityInput directive ')
            }
        }
    }
}
