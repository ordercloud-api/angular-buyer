angular.module( 'orderCloud', [
        'templates-app',
        'ngSanitize',
        'ngAnimate',
        'ngMessages',
        'ngTouch',
        'ui.tree',
        'ui.router',
        'ui.bootstrap',
        'orderCloud.sdk',
        'toastr',
        'jcs-autoValidate',
        'ordercloud-infinite-scroll',
        'ordercloud-buyer-select',
        'ordercloud-search',
        'ordercloud-assignment-helpers',
        'ordercloud-paging-helpers',
        'ordercloud-auto-id',
        'ordercloud-impersonation',
        'ordercloud-current-order',
        'ordercloud-address',
        'ordercloud-lineitems',
        'ui.grid',
        'ui.grid.infiniteScroll'
    ])

    .run( SetBuyerID )
    .config( Routing )
    .config( ErrorHandling )
    .controller( 'AppCtrl', AppCtrl )
    .constant("appname", "OrderCloud AngularJS Seed")

    //App Constants used by the OrderCloud SDK
    .constant("ocscope", "FullAccess")
    .constant("clientid", "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")
    .constant("buyerid", "XXXXXXXXXX")

    //OrderCloud Base URLs
    .constant("authurl", "https://auth.ordercloud.io/oauth/token")
    .constant("apiurl", "https://api.ordercloud.io")

;

function SetBuyerID( BuyerID, buyerid ) {
    BuyerID.Get() ? angular.noop() : BuyerID.Set(buyerid);
}

function Routing( $urlRouterProvider, $urlMatcherFactoryProvider ) {
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise( '/home' );
    //$locationProvider.html5Mode(true);
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

function AppCtrl( $rootScope, $state, appname, Auth, BuyerID, ImpersonationService ) {
    var vm = this;
    vm.name = appname;
    vm.title = appname;
    vm.showLeftNav = true;
    vm.toggleLeftNav = function() {
        vm.showLeftNav = !vm.showLeftNav;
    };
    vm.logout = function() {
        Auth.RemoveToken();
        BuyerID.Set(null);
        ImpersonationService.StopImpersonating();
        $state.go('login');
    };
    vm.EndImpersonation = ImpersonationService.StopImpersonating;
    vm.isImpersonating = !!Auth.GetImpersonating();
    $rootScope.$on('ImpersonationStarted', function() {
        vm.isImpersonating = true;
    });
    $rootScope.$on('ImpersonationStopped', function() {
        vm.isImpersonating = false;
    });
    $rootScope.$on('$stateChangeSuccess', function(e, toState) {
        if (toState.data && toState.data.componentName) {
            vm.title = appname + ' - ' + toState.data.componentName
        } else {
            vm.title = appname;
        }
    });
}