angular.module('orderCloud')
    .controller('RegisterCtrl', RegisterController)
;

function RegisterController($window, $exceptionHandler, OrderCloudSDK, ocAnonymous, clientid, scope) {
    var vm = this;
    vm.info = {
        FirstName: null,
        LastName: null,
        Username: null,
        Password: null,
        ConfirmPassword: null,
        Phone: null,
        Email: null,
        Active: true
    };

    vm.onUsernameChange = function() {
        if (vm.form.Username.$error['User.UsernameMustBeUnique']) vm.form.Username.$setValidity('User.UsernameMustBeUnique', true);
    };
    
    vm.submit = function() {
        var anonymousToken = OrderCloudSDK.GetToken();
        vm.loading = OrderCloudSDK.Me.Register(anonymousToken, vm.info)
            .then(function() {
                return OrderCloudSDK.Auth.Login(vm.info.Username, $window.encodeURIComponent(vm.info.Password), clientid, scope)
                    .then(function(data) {
                        OrderCloudSDK.SetToken(data.access_token);
                        return OrderCloudSDK.Me.TransferAnonUserOrder(anonymousToken)
                            .then(function() {
                                ocAnonymous.Redirect();
                            });
                    });
            })
            .catch(function(ex) {
                if (ex.response && ex.response.body && ex.response.body.Errors.length && ex.response.body.Errors[0].ErrorCode === 'User.UsernameMustBeUnique') {
                    vm.form.Username.$setValidity('User.UsernameMustBeUnique', false);
                } else {
                    $exceptionHandler(ex);
                }
            });

    };
}