angular.module('orderCloud')
    .controller('RegisterCtrl', RegisterController)
;

function RegisterController(OrderCloudSDK, ocAnonymous, clientid, scope) {
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
    
    vm.submit = function() {
        var anonymousToken = OrderCloudSDK.GetToken();
        vm.loading = OrderCloudSDK.Me.Register(anonymousToken, vm.info)
            .then(function() {
                return OrderCloudSDK.Auth.Login(vm.info.Username, vm.info.Password, clientid, scope)
                    .then(function(data) {
                        OrderCloudSDK.SetToken(data.access_token);
                        return OrderCloudSDK.Me.TransferAnonUserOrder(anonymousToken)
                            .then(function() {
                                ocAnonymous.Redirect();
                            });
                    });
            })
            .catch(function(ex) {
                console.log(ex);
                var orderid = 'FJk60Hhho0ac2yawaooKSQ';
            });

    };
}