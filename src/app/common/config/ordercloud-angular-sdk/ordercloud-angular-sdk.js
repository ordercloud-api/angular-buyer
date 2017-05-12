angular.module('orderCloud')
    .run(OrderCloudAngularSDKConfig)
    .config(OrderCloudSDKAuthAdditions)
;

function OrderCloudAngularSDKConfig(OrderCloudSDK, ocAppName, apiurl, authurl) {
    var cookiePrefix = ocAppName.Watch().replace(/ /g, '_').toLowerCase();
    var apiVersion = 'v1';
    OrderCloudSDK.Config(cookiePrefix, apiurl + '/' + apiVersion, authurl);
}

function OrderCloudSDKAuthAdditions($provide) {
    $provide.decorator('OrderCloudSDK', function($delegate, $cookies, $state, ocAppName) {
        function orderCloudAuthLogout() {
            var cookiePrefix = ocAppName.Watch().replace(/ /g, '_').toLowerCase();
            angular.forEach($cookies.getAll(), function(value, key) {
                if (key.indexOf(cookiePrefix) > -1) $cookies.remove(key);
            });
            $state.go('login');
        }
        $delegate.Auth.Logout = orderCloudAuthLogout;
        return $delegate;
    });
}