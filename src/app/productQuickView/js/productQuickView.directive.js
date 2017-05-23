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
            element.bind('click', function() {
                ocProductQuickView.Open(scope.currentOrder, scope.product);
            });

            element.css('cursor', 'pointer');
        }
    }
}