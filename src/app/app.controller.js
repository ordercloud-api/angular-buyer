angular.module('orderCloud')
    .controller('AppCtrl', AppController)
;

function AppController($q, $rootScope, $state, $ocMedia, toastr, LoginService, appname, anonymous, defaultstate) {
    var vm = this;
    vm.name = appname;
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

    $rootScope.$on('$stateChangeSuccess', function() {
        cleanLoadingIndicators();
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