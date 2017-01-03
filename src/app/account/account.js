angular.module('orderCloud')
	.config(AccountConfig)
	.controller('AccountInfoCtrl', AccountInfoController)
	.controller('AccountEditModalCtrl', AccountEditModalController)
	.factory('AccountService', AccountService)
	.controller('ChangePasswordModalCtrl', ChangePasswordModalController)
	.controller('ConfirmPasswordCtrl', ConfirmPasswordController)
;

function AccountConfig($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/account', '/account/information');
	$stateProvider
		.state('account', {
			parent: 'base',
			abstract: true,
			url: '/account',
			templateUrl: 'account/templates/account.tpl.html',
			data: {
				pageTitle: "Account"
			}
		})
		.state('account.information', {
			url: '/overview',
			templateUrl: 'account/templates/accountDefaultView.tpl.html',
			controller: 'AccountInfoCtrl',
			controllerAs: 'accountInfo'
		})
	;
}

function AccountService($q, $uibModal, OrderCloud, toastr) {
	var service = {
		Update: _update,
		ChangePassword: _changePassword
	};

	function _update(currentProfile, newProfile) {
		var deferred = $q.defer();

		function updateUser() {
			OrderCloud.Me.Update(newProfile)
				.then(function(data) {
					deferred.resolve(data);
				})
				.catch(function(ex) {
					deferred.reject(ex);
				});
		}

		$uibModal.open({
			animation: true,
			templateUrl: 'account/templates/confirmPassword.modal.tpl.html',
			controller: 'ConfirmPasswordCtrl',
			controllerAs: 'confirmPassword',
			size: 'md'
		}).result.then(function(password) {
			var checkPasswordCredentials = {
				Username: currentProfile.Username,
				Password: password
			};

			OrderCloud.Auth.GetToken(checkPasswordCredentials)
				.then(function() {
					updateUser();
					toastr.success('Account changes were saved.', 'Success!');
				})
				.catch(function(ex) {
					deferred.reject(ex);
				});
		}, function() {
			angular.noop();
		});

		return deferred.promise;
	}

	function _changePassword(currentUser) {
		var deferred = $q.defer();

		var checkPasswordCredentials = {
			Username: currentUser.Username,
			Password: currentUser.CurrentPassword
		};

		function changePassword() {
			currentUser.Password = currentUser.NewPassword;
			OrderCloud.Me.Update(currentUser)
				.then(function() {
					deferred.resolve();
				});
		}

		OrderCloud.Auth.GetToken(checkPasswordCredentials)
			.then(function() {
				changePassword();
			})
			.catch(function(ex) {
				deferred.reject(ex);
			});

		return deferred.promise;
	}

	return service;
}

function AccountInfoController($uibModal, CurrentUser){
	var vm = this;
	vm.profile = angular.copy(CurrentUser);
	vm.currentUser = CurrentUser;

	vm.editInfo = function(){
		$uibModal.open({
			animation: true,
			templateUrl: 'account/templates/accountSettings.modal.tpl.html',
			controller: 'AccountEditModalCtrl',
			controllerAs: 'accountEditModal',
			backdrop:'static',
			size: 'md',
			resolve: {
				Profile: function(){
					return vm.profile;
				},
				CurrentUser: function(){
					return vm.currentUser;
				}
			}
		});
	};

	vm.changePassword = function(user){
		$uibModal.open({
			animation: true,
			templateUrl: 'account/templates/changePassword.modal.tpl.html',
			controller: 'ChangePasswordModalCtrl',
			controllerAs: 'changePasswordModal',
			backdrop:'static',
			size: 'md',
			resolve: {
				CurrentUser: function(){
					return user;
				}
			}
		});
	};
}

function AccountEditModalController($uibModalInstance, $exceptionHandler, AccountService, CurrentUser, Profile){
	var vm = this;
	vm.profile = Profile;
	var currentProfile = CurrentUser;

	vm.update = function() {
		AccountService.Update(currentProfile, vm.profile)
			.then(function(data) {
				vm.profile = angular.copy(data);
				currentProfile = data;
				vm.submit();
			})
			.catch(function(ex) {
				vm.profile = currentProfile;
				$exceptionHandler(ex);
			});
	};

	vm.resetForm = function(form) {
		vm.profile = currentProfile;
		form.$setPristine(true);
	};

	vm.submit = function() {
		$uibModalInstance.close();
	};

	vm.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
}

function ChangePasswordModalController(toastr, $state, $exceptionHandler, AccountService, $uibModalInstance, CurrentUser){
	var vm = this;
	vm.currentUser = CurrentUser;

	vm.changePassword = function() {
		AccountService.ChangePassword(vm.currentUser)
			.then(function() {
				toastr.success('Password successfully changed', 'Success!');
				vm.currentUser.CurrentPassword = null;
				vm.currentUser.NewPassword = null;
				vm.currentUser.ConfirmPassword = null;
				vm.submit();
				$state.go('account.information');
			})
			.catch(function(ex) {
				$exceptionHandler(ex);
			});
	};

	vm.submit = function() {
		$uibModalInstance.close();
	};

	vm.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
}

function ConfirmPasswordController($uibModalInstance) {
	var vm = this;

	vm.submit = function() {
		$uibModalInstance.close(vm.password);
	};

	vm.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
}