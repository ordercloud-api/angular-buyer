angular.module('orderCloud')
	.factory('ocAccount', OrderCloudAccountService)
;

function OrderCloudAccountService($q, $uibModal, $cookies, ocAppName) {
	var service = {
        ConfirmPassword: _confirmPassword,
        ChangePassword: _changePassword
    };

    function _confirmPassword(currentUser) {
        var hasConfirmed = $cookies.get('oc_has_confirmed.' + ocAppName.Watch());
        if (hasConfirmed) {
            var df = $q.defer();
            df.resolve();
            return df.promise;
        } else {
            return $uibModal.open({
                templateUrl: 'account/templates/confirmPassword.modal.html',
                controller: 'ConfirmPasswordModalCtrl',
                controllerAs: 'confirmPasswordModal',
                size: 'confirm',
                resolve: {
                    CurrentUser: function () {
                        return currentUser;
                    }
                }
            }).result;
        }
    }

    function _changePassword(currentUser) {
        return $uibModal.open({
            templateUrl: 'account/templates/changePassword.modal.html',
            controller: 'ChangePasswordModalCtrl',
            controllerAs: 'changePasswordModal',
            size: 'confirm',
            resolve: {
                CurrentUser: function () {
                    return currentUser;
                }
            }
        }).result;

    }

	return service;
}