angular.module('orderCloud')
    .config(AppConfig)
;

function AppConfig($urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, defaultstate, $qProvider, $provide, $httpProvider) {
    //Routing
    $locationProvider.html5Mode(true);
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go(defaultstate); //Set the default state name in app.constants.json
    });

    //Error Handling
    $provide.decorator('$exceptionHandler', handler);
    $qProvider.errorOnUnhandledRejections(false); //Stop .catch validation from angular v1.6.0
    function handler($delegate, $injector) { //Catch all for unhandled errors
        return function(ex, cause) {
            $delegate(ex, cause);
            $injector.get('toastr').error(ex.data ? (ex.data.error || (ex.data.Errors ? ex.data.Errors[0].Message : ex.data)) : ex.message, 'Error');
        };
    }

    //HTTP Interceptor for OrderCloud Authentication
    $httpProvider.interceptors.push(function($q, $rootScope) {
        return {
            'responseError': function(rejection) {
                if (rejection.config.url.indexOf('ordercloud.io') > -1 && rejection.status == 401) {
                    $rootScope.$broadcast('OC:AccessInvalidOrExpired'); //Trigger RememberMe || AuthAnonymous in AppCtrl
                }
                if (rejection.config.url.indexOf('ordercloud.io') > -1 && rejection.status == 403){
                    $rootScope.$broadcast('OC:AccessForbidden'); //Trigger warning toastr message for insufficient permissions
                }
                return $q.reject(rejection);
            }
        };
    });
}