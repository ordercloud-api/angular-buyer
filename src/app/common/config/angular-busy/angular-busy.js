angular.module('orderCloud')
    .config(function(angularBusyDefaults) {
        angular.extend(angularBusyDefaults, {
            templateUrl:'common/config/angular-busy/angular-busy.html',
            message:null,
            wrapperClass: 'indicator-container'
        })
    })
;