angular.module( 'orderCloud' )
    .directive('confirmpassword', confirmpassword)
;

function confirmpassword() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return;

            //watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function () {
                validate();
            });

            //watch other value and re-validate on change
            attrs.$observe('confirmpassword', function (val) {
                validate();
            });

            var validate = function() {
                var val1 = ngModel.$viewValue;
                var val2 = attrs.confirmpassword;

                (!val1 || !val2 || val1 === val2) ? ngModel.$setValidity('confirmpassword', true) : ngModel.$setValidity('confirmpassword', false);

            }
        }
    }
}


