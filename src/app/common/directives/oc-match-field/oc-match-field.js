angular.module('orderCloud')
    .directive('ocMatchField', OrderCloudMatchFieldDirective)
;

function OrderCloudMatchFieldDirective() {
    return {
        scope: {
            ocMatchField: '='
        },
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            ngModelCtrl.$validators['oc-match-field'] = function(val) {
                return val === scope.ocMatchField;
            };
        }
    };
}