angular.module('orderCloud')
    .config(LoginConfig)
    .factory('LoginService', LoginService)
    .controller('LoginCtrl', LoginController)
<<<<<<< HEAD
=======
    .directive('prettySubmit', function () {
        return function (scope, element) {
            $(element).submit(function(event) {
                event.preventDefault();
            });
        };
    })
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
;

function LoginConfig($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login/:token',
            templateUrl: 'login/templates/login.tpl.html',
            controller: 'LoginCtrl',
            controllerAs: 'login'
        })
    ;
}

<<<<<<< HEAD
function LoginService($q, $window, $state, toastr, OrderCloud, TokenRefresh, clientid, buyerid, anonymous) {
=======
function LoginService($q, $window, $state, $cookies, toastr, OrderCloud, clientid, buyerid, anonymous) {
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
    return {
        SendVerificationCode: _sendVerificationCode,
        ResetPassword: _resetPassword,
        RememberMe: _rememberMe,
<<<<<<< HEAD
=======
        AuthAnonymous: _authAnonymous,
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
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

<<<<<<< HEAD
    function _logout(){
        OrderCloud.Auth.RemoveToken();
        OrderCloud.Auth.RemoveImpersonationToken();
        OrderCloud.BuyerID.Set(null);
        TokenRefresh.RemoveToken();
=======
    function _authAnonymous() {
        return OrderCloud.Auth.GetToken('')
            .then(function(data) {
                OrderCloud.BuyerID.Set(buyerid);
                OrderCloud.Auth.SetToken(data.access_token);
                $state.go('home');
            });
    }

    function _logout() {
        angular.forEach($cookies.getAll(), function(val, key) {
            $cookies.remove(key);
        });
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
        $state.go(anonymous ? 'home' : 'login', {}, {reload: true});
    }

    function _rememberMe() {
<<<<<<< HEAD
        TokenRefresh.GetToken()
            .then(function (refreshToken) {
                if (refreshToken) {
                    TokenRefresh.Refresh(refreshToken)
                        .then(function(token) {
                            OrderCloud.BuyerID.Set(buyerid);
                            OrderCloud.Auth.SetToken(token.access_token);
                            $state.go('home');
                        })
                        .catch(function () {
                            toastr.error('Your token has expired, please log in again.');
                        });
                } else {
                    _logout();
                }
            });
    }
}

function LoginController($state, $stateParams, $exceptionHandler, OrderCloud, LoginService, TokenRefresh, buyerid) {
=======
        var availableRefreshToken = OrderCloud.Refresh.ReadToken() || null;

        if (availableRefreshToken) {
            OrderCloud.Refresh.GetToken(availableRefreshToken)
                .then(function(data) {
                    OrderCloud.BuyerID.Set(buyerid);
                    OrderCloud.Auth.SetToken(data.access_token);
                    $state.go('home');
                })
                .catch(function () {
                    toastr.error('Your token has expired, please log in again.');
                    _logout();
                });
        } else {
            _logout();
        }
    }
}

function LoginController($state, $stateParams, $exceptionHandler, OrderCloud, LoginService, buyerid) {
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
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
<<<<<<< HEAD
        OrderCloud.Auth.GetToken(vm.credentials)
            .then(function(data) {
                vm.rememberStatus ? TokenRefresh.SetToken(data['refresh_token']) : angular.noop();
=======
        $('#Username').blur();
        $('#Password').blur();
        $('#Remember').blur();
        $('#submit_login').blur();
        vm.loading = OrderCloud.Auth.GetToken(vm.credentials)
            .then(function(data) {
                vm.rememberStatus ? OrderCloud.Refresh.SetToken(data['refresh_token']) : angular.noop();
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
                OrderCloud.BuyerID.Set(buyerid);
                OrderCloud.Auth.SetToken(data['access_token']);
                $state.go('home');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
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