angular.module( 'orderCloud' )

    .config( LoginConfig )
    .factory( 'LoginService', LoginService )
    .controller( 'LoginCtrl', LoginController )

;

function LoginConfig( $stateProvider ) {
    $stateProvider
        .state( 'login', {
            url: '/login/:token',
            templateUrl:'login/templates/login.tpl.html',
            controller:'LoginCtrl',
            controllerAs: 'login'
        })
}

function LoginService( $q, $window, toastr, $state,OrderCloud, clientid, buyerid, TokenRefresh ) {
    return {
        SendVerificationCode: _sendVerificationCode,
        ResetPassword: _resetPassword,
        RememberMe: _rememberMe,
        Logout: _logout
    };

    function _sendVerificationCode(email) {
        var deferred = $q.defer();

        var passwordResetRequest = {
            Email: email,
            ClientID: clientid,
            URL: encodeURIComponent($window.location.href) + '{0}'
        };

        OrderCloud.PasswordResets.SendVerificationCode(passwordResetRequest)
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

        OrderCloud.PasswordResets.ResetPassword(verificationCode, passwordReset).
            then(function() {
                deferred.resolve();
            })
            .catch(function(ex) {
                deferred.reject(ex);
            });

        return deferred.promise;
    }

    function _logout(){
        OrderCloud.Auth.RemoveToken();
        OrderCloud.Auth.RemoveImpersonationToken();
        OrderCloud.BuyerID.Set(null);
        TokenRefresh.RemoveToken();
        $state.go('login');
    }

    function _rememberMe() {
        TokenRefresh.GetToken()
            .then(function (refreshToken) {
                if (refreshToken) {
                    TokenRefresh.Refresh(refreshToken)
                        .then(function (token) {
                            OrderCloud.BuyerID.Set(buyerid);
                            OrderCloud.Auth.SetToken(token.access_token);
                            $state.go('home')
                        })
                        .catch(function () {
                            toastr.error("Your token has expired, please log in again.")
                        });
                }else{
                    _logout();
                }
            })
    }
}

function LoginController( $state, $stateParams, $exceptionHandler, OrderCloud, LoginService, buyerid, TokenRefresh ) {
    var vm = this;
    vm.credentials = {
        Username: null,
        Password: null
    };
    vm.token = $stateParams.token;
    vm.form = vm.token ? 'reset' : 'login';
    vm.setForm = function(form) {
        vm.form = form;
    };
    vm.rememberStatus = false;

    vm.submit = function() {
        OrderCloud.Auth.GetToken(vm.credentials)
            .then(function(data) {
                vm.rememberStatus ? TokenRefresh.SetToken(data['refresh_token']) : angular.noop();
                OrderCloud.BuyerID.Set(buyerid);
                OrderCloud.Auth.SetToken(data['access_token']);
                $state.go('home');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            })
    };

    vm.forgotPassword = function() {
        LoginService.SendVerificationCode(vm.credentials.Email)
            .then(function() {
                vm.setForm('verificationCodeSuccess');
                vm.credentials.Email = null;
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.resetPassword = function() {
        LoginService.ResetPassword(vm.credentials, vm.token)
            .then(function() {
                vm.setForm('resetSuccess');
                vm.token = null;
                vm.credentials.ResetUsername = null;
                vm.credentials.NewPassword = null;
                vm.credentials.ConfirmPassword = null;
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
                vm.credentials.ResetUsername = null;
                vm.credentials.NewPassword = null;
                vm.credentials.ConfirmPassword = null;
            });
    };
}