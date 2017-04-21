angular.module('orderCloud')
    .controller('LoginCtrl', LoginController)
;

function LoginController($state, $stateParams, $exceptionHandler, OrderCloudSDK, LoginService, ocRoles, buyerid, clientid, scope) {
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
        vm.loading = OrderCloudSDK.Auth.Login(vm.credentials.Username, vm.credentials.Password, clientid, scope)
            .then(function(data) {
                OrderCloudSDK.SetToken(data.access_token);
                if (vm.rememberStatus) OrderCloudSDK.SetRefreshToken(data['refresh_token']);
                var roles = ocRoles.Set(data.access_token);
                if (roles.length == 1 && roles[0] == 'PasswordReset') {
                    vm.token = data.access_token;
                    vm.form = 'resetByToken';
                } else {
                    $state.go('home');
                }
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.forgotPassword = function() {
        vm.loading = LoginService.SendVerificationCode(vm.credentials.Email)
            .then(function() {
                vm.setForm('verificationCodeSuccess');
                vm.credentials.Email = null;
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.resetPasswordByToken = function() {
        vm.loading = OrderCloudSDK.Me.ResetPasswordByToken({NewPassword:vm.credentials.NewPassword})
            .then(function(data) {
                vm.setForm('resetSuccess');
                vm.credentials = {
                    Username:null,
                    Password:null
                };
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.resetPassword = function() {
        vm.loading = LoginService.ResetPassword(vm.credentials, vm.token)
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