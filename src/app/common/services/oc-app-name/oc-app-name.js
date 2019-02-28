angular.module('orderCloud')
    .factory('ocAppName', function(appname) {
        var appName = appname;
        var service = {
            Watch: _watch,
            Update: _update
        };

        function _update(newAppName) {
            appName = newAppName;
        }

        function _watch() {
            return appName;
        }

        return service;

    })
;

