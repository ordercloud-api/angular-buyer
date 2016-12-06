angular.module('orderCloud')
	.factory('OrderCloudConfirm', OrderCloudConfirmService)
	.controller('ConfirmModalCtrl', ConfirmModalController)
;

function OrderCloudConfirmService($uibModal) {
	var service = {
		Confirm: _confirm
	};

	function _confirm(message) {
		return $uibModal.open({
			animation:false,
			backdrop:'static',
			templateUrl: 'common/confirm/templates/confirm.modal.tpl.html',
			controller: 'ConfirmModalCtrl',
			controllerAs: 'confirmModal',
			size: 'sm',
			resolve: {
				ConfirmMessage: function() {
					return message;
				}
			}
		}).result
	}

	return service;
}

function ConfirmModalController($uibModalInstance, ConfirmMessage) {
	var vm = this;
	vm.message = ConfirmMessage;

	vm.confirm = function() {
		$uibModalInstance.close();
	};

	vm.cancel = function() {
		$uibModalInstance.dismiss();
	};
}