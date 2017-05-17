angular.module('orderCloud')
    .factory('ocRefreshToken', OrderCloudRefreshTokenService)
;

function OrderCloudRefreshTokenService($exceptionHandler, $rootScope, $state, $log, toastr, OrderCloudSDK, clientid, scope, defaultstate, anonymous) {
    $rootScope.$on('OC:InvalidOrExpiredAccessToken', function() {
        refreshToken();
    });

    function refreshToken(redirectState) {
        var token = OrderCloudSDK.GetRefreshToken() || null;
        if (token) {
            OrderCloudSDK.Auth.RefreshToken(token, clientid, scope)
                .then(function(data) {
                    OrderCloudSDK.SetToken(data.access_token);
                    _redirect();
                })
                .catch(function () {
                    anonymous ? _authAnonymous() : _logout();
                });
        } else {
            anonymous ? _authAnonymous() : _logout();
        }

        function _authAnonymous() {
            OrderCloudSDK.Auth.Anonymous(clientid, scope)
                .then(function(data) {
                    OrderCloudSDK.SetToken(data.access_token);
                    // Intentionally not storing the potential refresh_token because OrderCloud identifies this grant-type as not anonymous.
                    // Basically, if we use the refresh token grant type to keep the anon user logged in, we lose the orderid property
                    // on the users token that identifies them as anonymous in base.config.js
                    _redirect();
                })
                .catch(function(ex) {
                    if (ex.response && ex.response.body && ex.response.body.error === 'invalid_grant') {
                        $log.error('The current clientid is not configured for anonymous shopping.');
                    } else {
                        $exceptionHandler(ex);
                    }
                });
        }

        function _redirect() {
            if (redirectState) {
                $state.go(redirectState);
            } else if ($state.current.name === '') {
                $state.go(defaultstate);
            } else {
                $state.go($state.current.name, {}, {reload:true});
            }
        }

        function _logout() {
            if(OrderCloudSDK.GetToken()) toastr.error('Your session has expired, please log in again.');
            OrderCloudSDK.Auth.Logout();
        }
    }

    return refreshToken;
}