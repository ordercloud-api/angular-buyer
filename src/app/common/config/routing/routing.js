angular.module('orderCloud')
    .config(function($urlMatcherFactoryProvider, $locationProvider, $urlRouterProvider, defaultstate, html5mode) {
        //Routing
        $urlMatcherFactoryProvider.strictMode(false);
        $locationProvider.html5Mode(html5mode);
        $urlRouterProvider
            .otherwise(function ($injector) {
                $injector.get('$state').go(defaultstate); //Set the default state name in app.constants.json
            });
    })
;


