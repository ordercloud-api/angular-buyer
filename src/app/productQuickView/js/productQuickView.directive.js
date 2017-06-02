angular.module('orderCloud')
    .directive('ocProductQuickView', OrderCloudProductQuickViewDirective)
;

function OrderCloudProductQuickViewDirective(ocProductQuickView) {
    return {
        restrict: 'A',
        scope: {
            product: '<',
			currentOrder: '<'
        },
        link: function(scope, element, attrs) {
            element.on('click', function() {
                return ocProductQuickView.Open(scope.currentOrder, scope.product);
            });
            scope.$on('destroy', function(){
                element.off('click');
            });
            element.css('cursor', 'pointer');
        }
    };
}