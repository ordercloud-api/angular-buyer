angular.module('orderCloud')
    //TODO: rename this to 'OrderCloud' once we finish refactoring to the new SDK
    .factory('sdkOrderCloud', OrderCloudService)
;

function OrderCloudService($cookies, $rootScope, $q, appname, apiurl, authurl) {
    // get sdk from global variable
    var sdk = {};
    var defaultClient = OrderCloudSDK.ApiClient.instance;
    var oauth2 = defaultClient.authentications['oauth2'];
    var cookieAppName = appname.replace(/ /g, '_').toLowerCase();
    var authTokenCookieName = cookieAppName + '.token';
    var impersonationTokenCookieName = cookieAppName + '.impersonation.token';
    var refreshTokenCookieName = cookieAppName + '.refresh.token';
    OrderCloudSDK.ApiClient.instance.baseApiPath = apiurl + '/v1';
    OrderCloudSDK.ApiClient.instance.baseAuthPath = authurl;
    for(var method in OrderCloudSDK) {
        if (OrderCloudSDK.hasOwnProperty(method)) {
            sdk[method] = {};
            for (var apiCall in OrderCloudSDK[method]) {
                if (OrderCloudSDK[method].hasOwnProperty(apiCall)) {
                    sdk[method][apiCall] = (function() {
                        var useMethod = method,
                            useApiCall = apiCall;
                        return function() {
                            var dfd = $q.defer();
                            dfd.resolve(OrderCloudSDK[useMethod][useApiCall].apply(OrderCloudSDK[useMethod], arguments));
                            return dfd.promise;
                        }
                    })();
                }
            }
        }
    }

    var _getToken = function() {
        var token = $cookies.get(authTokenCookieName);
        oauth2.accessToken = token;
        return token;
    };

    var _getImpersonationToken = function() {
        var token = $cookies.get(impersonationTokenCookieName);
        oauth2.impersonationToken = token;
        return token;
    };

    var _getRefreshToken = function() {
        var token = $cookies.get(refreshTokenCookieName);
        return token;
    }

    var _setToken = function(token) {
        oauth2.accessToken = token;
        $cookies.put(authTokenCookieName, token);
    };

    var _setImpersonationToken = function(token) {
        oauth2.impersonationToken = token;
        $cookies.put(impersonationTokenCookieName, token);
    };

    var _setRefreshToken = function(token) {
        $cookies.put(refreshTokenCookieName, token);
    }

    sdk.GetToken = _getToken;
    sdk.GetImpersonationToken = _getImpersonationToken;
    sdk.GetRefreshToken = _getRefreshToken;
    sdk.SetToken = _setToken;
    sdk.SetImpersonationToken = _setImpersonationToken;
    sdk.SetRefreshToken = _setRefreshToken;

    //init authentication for page refresh
    _getToken();
    _getImpersonationToken();

    return sdk;
}