angular.module('orderCloud')
    .config(RegisterConfig)
;

function RegisterConfig($stateProvider) {
    $stateProvider
        .state('register', {
            url: '/register',
            templateUrl: 'register/templates/register.html',
            controller: 'RegisterCtrl',
            controllerAs: 'register'
        });
}