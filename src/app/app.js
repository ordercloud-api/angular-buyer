angular.module('orderCloud', [
    'ngSanitize',
    'ngAnimate',
    'ngMessages',
    'ngTouch',
    'ui.tree',
    'ui.router',
    'ui.bootstrap',
    'orderCloud.sdk',
    'LocalForageModule',
    'toastr',
    'angular-busy',
    'jcs-autoValidate',
    'treeControl',
    'hl.sticky',
    'ordercloud-infinite-scroll',
    'ordercloud-buyer-select',
    'ordercloud-catalog-select',
    'ordercloud-search',
    'ordercloud-assignment-helpers',
    'ordercloud-paging-helpers',
    'ordercloud-auto-id',
    'ordercloud-address',
    'ordercloud-lineitems',
    'ordercloud-geography',
    'ordercloud-payment-authorizeNet',
    'ordercloud-credit-card'
    ])
    .config(AppConfig)
    .run(AppRun)
    .controller('AppCtrl', AppCtrl)
;

function AppConfig($urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, defaultstate, $qProvider, $provide, $httpProvider) {
    //Routing
    $locationProvider.html5Mode(true);
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go(defaultstate); //Set the default state name in app.config.json
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

function AppRun(OrderCloud, catalogid, uibDatepickerConfig, uibDatepickerPopupConfig, defaultErrorMessageResolver) {
    //Set Default CatalogID
    catalogid ? OrderCloud.CatalogID.Set(catalogid) : OrderCloud.CatalogID.Set(OrderCloud.BuyerID.Get());

    //Default Datepicker Options
    uibDatepickerConfig.showWeeks = false;
    uibDatepickerPopupConfig.showButtonBar = false;

    //Set Custom Error Messages for angular-auto-validate      --- http://jonsamwell.github.io/angular-auto-validate/ ---
    defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
        errorMessages['customPassword'] = 'Password must be at least eight characters long and include at least one letter and one number';
        //regex for customPassword = ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$
        errorMessages['positiveInteger'] = 'Please enter a positive integer';
        //regex positiveInteger = ^[0-9]*[1-9][0-9]*$
        errorMessages['ID_Name'] = 'Only Alphanumeric characters, hyphens and underscores are allowed';
        //regex ID_Name = ([A-Za-z0-9\-\_]+)
        errorMessages['confirmpassword'] = 'Your passwords do not match';
        errorMessages['noSpecialChars'] = 'Only Alphanumeric characters are allowed';
    });
}

function AppCtrl($q, $rootScope, $state, $ocMedia, toastr, LoginService, appname, anonymous, defaultstate) {
    var vm = this;
    vm.name = appname;
    vm.title = appname;
    vm.$state = $state;
    vm.$ocMedia = $ocMedia;
    vm.stateLoading = undefined;

    function cleanLoadingIndicators() {
        if (vm.stateLoading && vm.stateLoading.promise && !vm.stateLoading.promise.$cgBusyFulfilled) vm.stateLoading.resolve(); //resolve leftover loading promises
    }

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

    $rootScope.$on('$stateChangeStart', function(e, toState) {
        cleanLoadingIndicators();
        var defer = $q.defer();
        //defer.delay = 200;
        defer.wrapperClass = 'indicator-container';
        (toState.data && toState.data.loadingMessage) ? defer.message = toState.data.loadingMessage : defer.message = null;
        defer.templateUrl = 'common/loading-indicators/templates/view.loading.tpl.html';
        vm.stateLoading = defer;
    });

    $rootScope.$on('$stateChangeSuccess', function(e, toState) {
        cleanLoadingIndicators();
        if (toState.data && toState.data.componentName) {
            vm.title = toState.data.componentName + ' | ' + appname;
        } else {
            vm.title = appname;
        }
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        if (toState.name == defaultstate) event.preventDefault(); //prevent infinite loop when error occurs on default state (otherwise in Routing config)
        cleanLoadingIndicators();
        console.log(error);
    });

    $rootScope.$on('OC:AccessInvalidOrExpired', function() {
        if (anonymous) {
            cleanLoadingIndicators();
            LoginService.AuthAnonymous();
        } else {
            LoginService.RememberMe();
        }
    });

    $rootScope.$on('OC:AccessForbidden', function(){
        toastr.warning("You do not have permission to access this page.");
    });
}