angular.module('orderCloud')
    .factory('ocRefreshToken', OrderCloudRefreshTokenService)
;

function OrderCloudRefreshTokenService($rootScope, $state, toastr, OrderCloudSDK, clientid, scope, defaultstate) {
    $rootScope.$on('OC:InvalidOrExpiredAccessToken', function() {
        refreshToken();
    });

    function refreshToken() {
        var token = OrderCloudSDK.GetRefreshToken() || null;
        if (token) {
            OrderCloudSDK.Auth.RefreshToken(token, clientid, scope)
                .then(function(data) {
                    OrderCloudSDK.SetToken(data.access_token);
                    if ($state.current.name === '') {
                        $state.go(defaultstate);
                    } else {
                        $state.go($state.current.name, {}, {reload:true});
                    }
                })
                .catch(function () {
                    _logout();
                });
        } else {
            _logout();
        }

        function _logout() {
            toastr.error('Your session has expired, please log in again.');
            OrderCloudSDK.Auth.Logout();
        }
    }

    return refreshToken;
}