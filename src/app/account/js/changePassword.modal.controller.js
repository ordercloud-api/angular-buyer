angular.module('orderCloud')
	.controller('ChangePasswordModalCtrl', ChangePasswordModalController);

function ChangePasswordModalController($exceptionHandler, OrderCloudSDK, $uibModalInstance, CurrentUser, clientid, scope) {
	var vm = this;
	vm.currentUser = CurrentUser;

	vm.submit = function () {
		var checkPasswordCredentials = {
			Username: vm.currentUser.Username,
			Password: vm.currentUser.CurrentPassword
		};

		return vm.loading = OrderCloudSDK.Auth.Login(checkPasswordCredentials.Username, checkPasswordCredentials.Password, clientid, scope)
			.then(function () {
				return OrderCloudSDK.Me.ResetPasswordByToken({
						NewPassword: vm.currentUser.NewPassword
					})
					.then(function () {
						$uibModalInstance.close();
					});
			})
			.catch(function (ex) {
				$exceptionHandler(ex);
			});
	};

	vm.cancel = function () {
		$uibModalInstance.dismiss();
	};
}