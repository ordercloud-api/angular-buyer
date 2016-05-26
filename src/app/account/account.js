angular.module( 'orderCloud' )

	.config( AccountConfig )
	.controller( 'AccountCtrl', AccountController )
	.factory( 'AccountService', AccountService )
	.controller( 'ConfirmPasswordCtrl', ConfirmPasswordController )
	.controller( 'ChangePasswordCtrl', ChangePasswordController )

;

function AccountConfig( $stateProvider ) {
	$stateProvider
		.state( 'account', {
			parent: 'base',
			url: '/account',
			templateUrl:'account/templates/account.tpl.html',
			controller:'AccountCtrl',
			controllerAs: 'account'
		})
		.state( 'account.changePassword', {
			url: '/changepassword',
			templateUrl: 'account/templates/changePassword.tpl.html',
			controller: 'ChangePasswordCtrl',
			controllerAs: 'changePassword'
		})
}

function AccountService( $q, $uibModal, OrderCloud ) {
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
				})
		}

		$uibModal.open({
			animation: true,
			templateUrl: 'account/templates/confirmPassword.modal.tpl.html',
			controller: 'ConfirmPasswordCtrl',
			controllerAs: 'confirmPassword',
			size: 'sm'
		}).result.then(function(password) {
			var checkPasswordCredentials = {
				Username: currentProfile.Username,
				Password: password
			};
			OrderCloud.Auth.GetToken(checkPasswordCredentials).then(
				function() {
					updateUser();
				}).catch(function( ex ) {
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

		OrderCloud.Auth.GetToken(checkPasswordCredentials).then(
			function() {
				changePassword();
			}).catch(function( ex ) {
				deferred.reject(ex);
			});

		return deferred.promise;
	}

	return service;
}

function AccountController( $exceptionHandler, toastr, CurrentUser, AccountService ) {
	var vm = this;
	vm.profile = angular.copy(CurrentUser);
	var currentProfile = CurrentUser;

	vm.update = function() {
		AccountService.Update(currentProfile, vm.profile)
			.then(function(data) {
				vm.profile = angular.copy(data);
				currentProfile = data;
				toastr.success('Account changes were saved.', 'Success!');
			})
			.catch(function(ex) {
				vm.profile = currentProfile;
				$exceptionHandler(ex)
			})
	};

	vm.resetForm = function(form) {
		vm.profile = currentProfile;
		form.$setPristine(true);
	};
}

function ConfirmPasswordController( $uibModalInstance ) {
	var vm = this;

	vm.submit = function() {
		$uibModalInstance.close(vm.password);
	};

	vm.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
}

function ChangePasswordController( $state, $exceptionHandler, toastr, AccountService, CurrentUser ) {
	var vm = this;
	vm.currentUser = CurrentUser;

	vm.changePassword = function() {
		AccountService.ChangePassword(vm.currentUser)
			.then(function() {
				toastr.success('Password successfully changed', 'Success!');
				vm.currentUser.CurrentPassword = null;
				vm.currentUser.NewPassword = null;
				vm.currentUser.ConfirmPassword = null;
				$state.go('account');
			})
			.catch(function(ex) {
				$exceptionHandler(ex)
			});
	};
}
