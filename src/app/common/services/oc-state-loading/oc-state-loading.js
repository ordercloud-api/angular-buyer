angular.module('orderCloud')
    .factory('ocStateLoading', function($rootScope, $ocMedia, $exceptionHandler, defaultstate, $q) {
        var stateLoading = {};
        var service = {
            Init: _init,
            Watch: _watch
        };

        function _init() {
            $rootScope.$on('$stateChangeStart', function(e, toState) {
                var parent = toState.parent || toState.name.split('.')[0];
                stateLoading[parent] = $q.defer();
                if ($ocMedia('max-width:767px')) $('#GlobalNav').offcanvas('hide');
            });

            $rootScope.$on('$stateChangeSuccess', function() {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _end();
            });

            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
                if (toState.name == defaultstate) event.preventDefault(); //prevent infinite loop when error occurs on default state (otherwise in Routing config)
                error.data ? $exceptionHandler(error) : $exceptionHandler({message:error});
                _end();
            });
        }

        function _watch(key) {
            return stateLoading[key];
        }

        function _end() {
            angular.forEach(stateLoading, function(val, key) {
                if (stateLoading[key].promise && !stateLoading[key].promise.$cgBusyFulfilled) {
                    stateLoading[key].resolve();  //resolve leftover loading promises
                }
            })
        }

        return service;

    })
;

