angular.module('orderCloud')
    .factory('ocStateLoading', function($rootScope, $ocMedia, $exceptionHandler, $injector, $q) {
        var stateLoading = {};
        var service = {
            Init: _init,
            Watch: _watch,
            DefaultState: _defaultState
        };

        function _defaultState() {
            return $injector.get('defaultstate');
        }

        function _init() {
            $rootScope.$on('$stateChangeStart', function(e, toState) {
                var parent = toState.parent || toState.name.split('.')[0];
                stateLoading[parent] = $q.defer();
            });

            $rootScope.$on('$stateChangeSuccess', function() {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _end();
            });

            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
                if (toState.name == _defaultState()) event.preventDefault(); //prevent infinite loop when error occurs on default state (otherwise in Routing config)
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