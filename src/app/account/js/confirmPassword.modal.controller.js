angular.module('orderCloud')
	.controller('ConfirmPasswordModalCtrl', ConfirmPasswordModalController);

function ConfirmPasswordModalController($exceptionHandler, $uibModalInstance, CurrentUser, $cookies, OrderCloudSDK, appname, clientid, scope) {
	var vm = this;

	vm.submit = function () {
		var checkPasswordCredentials = {
			Username: CurrentUser.Username,
			Password: vm.password
		};

		OrderCloudSDK.Auth.Login(checkPasswordCredentials.Username, checkPasswordCredentials.Password, clientid, scope)
			.then(function () {
				var expiresIn = new Date();
				expiresIn.setMinutes(expiresIn.getMinutes() + 20);
				$cookies.put('oc_has_confirmed.' + appname, true, {
					expires: expiresIn
				});
				$uibModalInstance.close();
			})
			.catch(function (ex) {
				$exceptionHandler(ex);
				vm.password = null;
				vm.form.ConfirmPassword.$$element.focus();
			});
	};

	vm.cancel = function () {
		$uibModalInstance.dismiss();
	};
}