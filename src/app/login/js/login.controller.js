angular.module('orderCloud')
    .controller('LoginCtrl', LoginController);

function LoginController($state, $exceptionHandler, ocRoles, ocAnonymous, OrderCloudSDK, scope, clientid, defaultstate, anonymous) {
    var vm = this;
    vm.anonymousEnabled = anonymous;
    vm.credentials = {
        Username: null,
        Password: null
    };
    vm.rememberStatus = false;
    vm.form = 'login';
    vm.setForm = function (form) {
        vm.form = form;
    };

    vm.submit = function () {
        vm.loading = OrderCloudSDK.Auth.Login(vm.credentials.Username, vm.credentials.Password, clientid, scope)
            .then(function (data) {
                var anonymousToken = OrderCloudSDK.GetToken();
                OrderCloudSDK.SetToken(data.access_token);
                if (vm.rememberStatus && data['refresh_token']) OrderCloudSDK.SetRefreshToken(data['refresh_token']);

                var roles = ocRoles.Set(data.access_token);
                if (roles.length === 1 && roles[0] === 'PasswordReset') {
                    vm.token = data.access_token;
                    vm.form = 'resetByToken';
                } else if (anonymous) {
                    return ocAnonymous.MergeOrders(anonymousToken)
                        .then(function() {
                            ocAnonymous.Redirect();
                        });
                } else {
                    $state.go(defaultstate);
                }
            })
            .catch(function (ex) {
                $exceptionHandler(ex);
            });
    };

    vm.forgotPassword = function () {
        vm.loading = OrderCloudSDK.PasswordResets.SendVerificationCode({
                Email: vm.credentials.Email,
                ClientID: clientid
            })
            .then(function () {
                vm.setForm('reset');
                vm.credentials.Email = null;
            })
            .catch(function (ex) {
                $exceptionHandler(ex);
            });
    };

    vm.resetPasswordByToken = function () {
        vm.loading = OrderCloudSDK.Me.ResetPasswordByToken({
                NewPassword: vm.credentials.NewPassword
            })
            .then(function () {
                vm.setForm('resetSuccess');
                vm.credentials = {
                    Username: null,
                    Password: null
                };
            })
            .catch(function (ex) {
                $exceptionHandler(ex);
            });
    };

    vm.resetPassword = function () {
        vm.loading = OrderCloudSDK.PasswordResets.ResetPasswordByVerificationCode(vm.verificationCode, {
                ClientID: clientid,
                Username: vm.credentials.ResetUsername,
                Password: vm.credentials.NewPassword
            })
            .then(function () {
                vm.setForm('resetSuccess');
                vm.credentials.ResetUsername = null;
                vm.credentials.NewPassword = null;
                vm.credentials.ConfirmPassword = null;
            })
            .catch(function (ex) {
                $exceptionHandler(ex);
                vm.credentials.ResetUsername = null;
                vm.credentials.NewPassword = null;
                vm.credentials.ConfirmPassword = null;
            });
    };
}