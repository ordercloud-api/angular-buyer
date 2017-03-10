angular.module('orderCloud')
    .directive('prettySubmit', prettySubmit)
;

function prettySubmit() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var el = document.createElement('div');
            el.setAttribute('ongesturestart', 'return;'); // or try "ontouchstart"
            var isTouch = (typeof el.ongesturestart === "function");

            if (isTouch) {
                $(element).attr('action', '.');
                $(element).submit(function(event) {
                    event.preventDefault();

                    //Watch this: it has been known to cause errors in angular before (ex. Aveda)
                    $(document.activeElement).blur();
                });
            }
        }
    };
}