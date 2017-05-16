angular.module('orderCloud')
    .config(LoginConfig)
;

function LoginConfig($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login/:validationCode',
            templateUrl: 'login/templates/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'login'
        })
    ;
}