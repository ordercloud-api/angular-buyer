angular.module( 'orderCloud', [
    'ngSanitize',
    'ngAnimate',
    'ngMessages',
    'ngTouch',
    'snap',
    'ui.tree',
    'ui.router',
    'ui.bootstrap',
    'orderCloud.sdk',
    'LocalForageModule',
    'toastr',
    'jcs-autoValidate',
    'ordercloud-infinite-scroll',
    'ordercloud-buyer-select',
    'ordercloud-search',
    'ordercloud-assignment-helpers',
    'ordercloud-paging-helpers',
    'ordercloud-auto-id',
    'ordercloud-current-order',
    'ordercloud-address',
    'ordercloud-lineitems',
    'ordercloud-geography'
])

    .run( SetBuyerID )
    .config( Routing )
    .config( ErrorHandling )
    .config( Interceptor )
    .controller( 'AppCtrl', AppCtrl )
    .config(DatePickerConfig)
;

function DatePickerConfig(uibDatepickerConfig, uibDatepickerPopupConfig){
    uibDatepickerConfig.showWeeks = false;
    uibDatepickerPopupConfig.showButtonBar = false;
}

function SetBuyerID( OrderCloud, buyerid ) {
    OrderCloud.BuyerID.Get() ? angular.noop() : OrderCloud.BuyerID.Set(buyerid);
}

function Routing( $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider ) {
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise( '/home' );
    $locationProvider.html5Mode(true);
}

function ErrorHandling( $provide ) {
    $provide.decorator('$exceptionHandler', handler);

    function handler( $delegate, $injector ) {
        return function( ex, cause ) {
            $delegate(ex, cause);
            $injector.get('toastr').error(ex.data ? (ex.data.error || (ex.data.Errors ? ex.data.Errors[0].Message : ex.data)) : ex.message, 'Error');
        };
    }
}

function AppCtrl( $rootScope, $state, appname, LoginService, toastr, $ocMedia ) {
    var vm = this;
    vm.name = appname;
    vm.title = appname;
    vm.$state = $state;
    vm.$ocMedia = $ocMedia;

    //Detect if the app was loaded on a touch device with relatively good certainty
    //http://stackoverflow.com/a/6262682
    vm.isTouchDevice = (function() {
        var el = document.createElement('div');
        el.setAttribute('ongesturestart', 'return;'); // or try "ontouchstart"
        return typeof el.ongesturestart === "function";
    })();

    vm.logout = function() {
        LoginService.Logout();
    };

    $rootScope.$on('$stateChangeSuccess', function(e, toState) {
        if (toState.data && toState.data.componentName) {
            vm.title = appname + ' - ' + toState.data.componentName
        } else {
            vm.title = appname;
        }
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        console.log(error);
    });

    $rootScope.$on('OC:AccessInvalidOrExpired', function() {
        LoginService.RememberMe();
    });
    $rootScope.$on('OC:AccessForbidden', function(){
        toastr.warning("I'm sorry, it doesn't look like you have permission to access this page.", 'Warning:');
    })
}

function Interceptor( $httpProvider ) {
    $httpProvider.interceptors.push(function($q, $rootScope) {
        return {
            'responseError': function(rejection) {
                if (rejection.config.url.indexOf('ordercloud.io') > -1 && rejection.status == 401) {
                    $rootScope.$broadcast('OC:AccessInvalidOrExpired');
                }
                if (rejection.config.url.indexOf('ordercloud.io') > -1 && rejection.status == 403){
                    $rootScope.$broadcast('OC:AccessForbidden');
                }
                return $q.reject(rejection);
            }
        };
    });
}