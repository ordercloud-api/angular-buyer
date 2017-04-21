angular.module('orderCloud')
    .controller('AppCtrl', AppController)
;

function AppController($rootScope, $state, $ocMedia, LoginService, appname, ocStateLoading, ocIsTouchDevice, ocRoles, anonymous, toastr) {
    var vm = this;
    vm.name = appname;
    vm.$state = $state;
    vm.$ocMedia = $ocMedia;
    vm.isTouchDevice = ocIsTouchDevice;
    vm.stateLoading = ocStateLoading.Watch;
    vm.logout = LoginService.Logout;
    vm.userIsAuthorized = ocRoles.UserIsAuthorized;

    $rootScope.$on('OC:AccessForbidden', function(){
        return toastr.warning('You do not have permission to do this', 'Warning');
    });
    $rootScope.$on('OC:InvalidOrExpiredAccessToken', function(){
        return anonymous ? LoginService.AuthAnonymous() : LoginService.RememberMe();
    });
}