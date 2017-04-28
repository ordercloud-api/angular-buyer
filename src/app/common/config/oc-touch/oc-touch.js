angular.module('orderCloud')
    .value('ocIsTouchDevice', false)
    .config(function($provide) {
        $provide.decorator('ocIsTouchDevice', function () {
            //Detect if the app was loaded on a touch device with relatively good certainty
            //http://stackoverflow.com/a/6262682

            var el = document.createElement('div');
            el.setAttribute('ongesturestart', 'return;'); // or try "ontouchstart"
            return typeof el.ongesturestart === "function";
        });
    })
;