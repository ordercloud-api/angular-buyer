angular.module('orderCloud')
//optimizations for production build
//https://docs.angularjs.org/guide/production
    .config(function($compileProvider, $injector){
        var isDev = $injector.get('node_env') !== 'production';
        $compileProvider.debugInfoEnabled(isDev);
        $compileProvider.commentDirectivesEnabled(isDev);
        $compileProvider.cssClassDirectivesEnabled(isDev);
    });