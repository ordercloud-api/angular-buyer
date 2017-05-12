angular.module('orderCloud')
    .directive('ocPrettySubmit', OrderCloudPrettySubmit)
;

function OrderCloudPrettySubmit() {
    return {
        restrict: 'A',
        require: '^form',
        link: function(scope, element, attrs, formCtrl) {
            //Mobile Submit
            var el = document.createElement('div');
            el.setAttribute('ongesturestart', 'return;'); // or try "ontouchstart"
            var isTouch = (typeof el.ongesturestart === 'function');

            if (isTouch) {
                $(element).attr('action', '.');
                $(element).submit(function(event) {
                    event.preventDefault();

                    //Watch this: it has been known to cause errors in angular before (ex. Aveda)
                    $(document.activeElement).blur();
                });
            }

            //Form Validation and Form Dirty for Submit Button
            var valid = formCtrl.$valid;
            var dirty = formCtrl.$dirty;

            var submitButton = findSubmit(element[0].elements);
            
            scope.$watch(function() { return formCtrl.$valid; }, function(formValid) {
                valid = formValid;
                updateForm();
            });

            scope.$watch(function() { return formCtrl.$dirty; }, function(formDirty) {
                dirty = formDirty;
                updateForm();
            });

            function updateForm() {
                if (!submitButton) {
                    //Submit button not immediately available if ng-if is used
                    submitButton = findSubmit(element[0].elements);
                    if (!submitButton) return;
                }

                if (dirty && valid) {
                    submitButton.disabled = false;
                }
                else if (!dirty || !valid) {
                    submitButton.disabled = true;
                }
            }

            function findSubmit(elements) {
                return _.findWhere(elements, {nodeName: 'BUTTON', type: 'submit'});
            }
        }
    };
}