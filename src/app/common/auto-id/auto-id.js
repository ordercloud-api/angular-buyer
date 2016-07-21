angular.module('ordercloud-auto-id', []);

angular.module('ordercloud-auto-id')
    .directive('ordercloudAutoId', ordercloudAutoIdDirective)
;

function ordercloudAutoIdDirective($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            boxtext: '@'
        },
        link: function(scope, element, attrs, ngModel) {
            scope.boxtext = scope.boxtext || 'Auto-Gen. ID';
            var autoID_element = angular.element("<span class='input-group-addon'><input ng-click='autoID.autoID()' type='checkbox' checked> {{boxtext}} </span>");
            //var initCheckbox = true;
            //if (scope.defaultvalue != undefined) {
            //    initCheckbox = scope.defaultvalue;
            //}
            //console.log(initCheckbox);
            if(element.parent().hasClass('input-group') == false) {
                element.wrap("<div class='input-group'></div>");
            }
            autoID_element.attr('checked', true);
            if (autoID_element.find('input').prop('checked')) {
                element.attr('disabled', true);
            }
            autoID_element.find('input').bind('click', function() {
                autoID_element.attr('checked', !autoID_element.prop('checked'));
                if (autoID_element.find('input').prop('checked')) {
                    element.attr('disabled', true);
                    element.attr('required', false);
                    element.attr('ng-required', false);
                    element.removeClass('ng-invalid');
                    element.removeClass('ng-invalid-required');
                    ngModel.$setViewValue(null);
                    ngModel.$render();
                }
                else {
                    element.attr('disabled', false);
                    element.attr('required', true);
                    element.attr('ng-required', true);
                }
            });
            element.after(autoID_element);
            $compile(autoID_element)(scope);
        }
    }
}
