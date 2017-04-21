angular.module('orderCloud')
    .factory('LoginService', LoginService)
;

function LoginService($q, $window, $state, $cookies, toastr, OrderCloudSDK, clientid, buyerid, anonymous, scope) {
    return {
        SendVerificationCode: _sendVerificationCode,
        ResetPassword: _resetPassword,
        RememberMe: _rememberMe,
        AuthAnonymous: _authAnonymous,
        Logout: _logout
    };

    function _sendVerificationCode(email) {
        var deferred = $q.defer();

        var passwordResetRequest = {
            Email: email,
            ClientID: clientid,
            URL: encodeURIComponent($window.location.href) + '{0}'
        };

        OrderCloudSDK.PasswordResets.SendVerificationCode(passwordResetRequest)
            .then(function() {
                deferred.resolve();
            })
            .catch(function(ex) {
                deferred.reject(ex);
            });

        return deferred.promise;
    }

    function _resetPassword(resetPasswordCredentials, verificationCode) {
        var deferred = $q.defer();

        var passwordReset = {
            ClientID: clientid,
            Username: resetPasswordCredentials.ResetUsername,
            Password: resetPasswordCredentials.NewPassword
        };

        OrderCloudSDK.PasswordResets.ResetPassword(verificationCode, passwordReset)
            .then(function() {
                deferred.resolve();
            })
            .catch(function(ex) {
                deferred.reject(ex);
            });

        return deferred.promise;
    }

    function _authAnonymous() {
        return OrderCloudSDK.Auth.Login('')
            .then(function(data) {
                OrderCloudSDK.SetToken(data.access_token);
                $state.go('home');
            });
    }

    function _logout() {
        angular.forEach($cookies.getAll(), function(val, key) {
            $cookies.remove(key);
        });
        $state.go(anonymous ? 'home' : 'login', {}, {reload: true});
    }

    function _rememberMe() {
        var availableRefreshToken = OrderCloudSDK.GetRefreshToken() || null;

        if (availableRefreshToken) {
            OrderCloudSDK.Auth.RefreshToken(availableRefreshToken, clientid, scope)
                .then(function(data) {
                    OrderCloudSDK.SetToken(data.access_token);
                    $state.go('home');
                })
                .catch(function () {
                    toastr.error('Your session has expired, please log in again.');
                    _logout();
                });
        } else {
            _logout();
        }
    }
}