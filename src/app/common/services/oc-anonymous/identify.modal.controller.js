angular.module('orderCloud')
    .controller('IdentifyModalCtrl', IdentifyModalController)
;

function IdentifyModalController($uibModalInstance, ocAppName) {
    var vm = this;
    vm.appName = ocAppName.Watch;
    vm.cancel = $uibModalInstance.dismiss;
    vm.login = function() {
        $uibModalInstance.dismiss('LOGIN');
    };
    vm.register = function() {
        $uibModalInstance.dismiss('REGISTER');
    };
}