angular.module('orderCloud')
    .config(function(angularBusyDefaults) {
        angular.extend(angularBusyDefaults, {
            templateUrl:'common/templates/view.loading.tpl.html',
            message:null,
            wrapperClass: 'indicator-container'
        })
    })
;