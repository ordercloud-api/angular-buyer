angular.module('orderCloud')
    .factory('ocConfirm', OrderCloudConfirmService)
    .controller('ConfirmModalCtrl', ConfirmModalController)
;

function OrderCloudConfirmService($uibModal) {
    var service = {
        Confirm: _confirm
    };

    function _confirm(options) {
        return $uibModal.open({
            backdrop:'static',
            templateUrl: 'common/services/oc-confirm/oc-confirm.modal.html',
            controller: 'ConfirmModalCtrl',
            controllerAs: 'confirmModal',
            size: options.size || 'confirm',
            resolve: {
                ConfirmOptions: function() {
                    return options;
                }
            }
        }).result
    }

    return service;
}

function ConfirmModalController($uibModalInstance, ConfirmOptions) {
    var vm = this;
    vm.message = ConfirmOptions.message;
    vm.confirmText = ConfirmOptions.confirmText;
    vm.cancelText = ConfirmOptions.cancelText;
    vm.type = ConfirmOptions.type;

    vm.confirm = function() {
        $uibModalInstance.close();
    };

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };
}