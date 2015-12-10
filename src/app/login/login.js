angular.module( 'orderCloud' )

	.config( LoginConfig )
	.factory( 'LoginService', LoginService )
	.controller( 'LoginCtrl', LoginController )

;

function LoginConfig( $stateProvider ) {
	$stateProvider.state( 'login', {
		url: '/login/:token',
		templateUrl:'login/templates/login.tpl.html',
		controller:'LoginCtrl',
		controllerAs: 'login',
		data:{
			limitAccess: false
		}
	});
}

function LoginService( $q, PasswordResets, clientid ) {
	var service = {
		SendVerificationCode: _sendVerificationCode,
		ResetPassword: _resetPassword
	};

	function _sendVerificationCode(email) {
		var deferred = $q.defer();

		var passwordResetRequest = {
			Email: email,
			ClientID: clientid,
			URL: encodeURIComponent($window.location.href) + '{0}'
		};

		PasswordResets.SendVerificationCode(passwordResetRequest)
			.then(function() {
				deferred.resolve();
			})
			.catch(function(ex) {
				deferred.reject(ex);
			});

		return deferred.promise;
	}

	function _resetPassword(resetPasswordCredentials, verificationCode) {
		var deferred = $q.defer();

		var passwordReset = {
			ClientID: clientid,
			Username: resetPasswordCredentials.ResetUsername,
			Password: resetPasswordCredentials.NewPassword
		};

		PasswordResets.ResetPassword(verificationCode, passwordReset).
			then(function() {
				deferred.resolve();
			})
			.catch(function(ex) {
				deferred.reject(ex);
			});

		return deferred.promise;
	}

	return service;
}

function LoginController( $state, $stateParams, $exceptionHandler, LoginService, Credentials ) {
	var vm = this;

	vm.token = $stateParams.token;
	vm.form = vm.token ? 'reset' : 'login';
	vm.setForm = function(form) {
		vm.form = form;
	};

	vm.submit = function( ) {
		Credentials.Get( vm.credentials ).then(
			function() {
				$state.go( 'base.home' );
			}).catch(function(ex) {
				$exceptionHandler(ex);
			});
	};

	vm.forgotPassword = function() {
		LoginService.SendVerificationCode(vm.credentials.Email)
			.then(function() {
				vm.setForm('verificationCodeSuccess');
				vm.credentials.Email = null;
			})
			.catch(function(ex) {
				$exceptionHandler(ex);
			});
	};

	vm.resetPassword = function() {
		LoginService.ResetPassword(vm.credentials, vm.token)
			.then(function() {
				vm.setForm('resetSuccess');
				vm.token = null;
				vm.credentials.ResetUsername = null;
				vm.credentials.NewPassword = null;
				vm.credentials.ConfirmPassword = null;
			})
			.catch(function(ex) {
				$exceptionHandler(ex);
				vm.credentials.ResetUsername = null;
				vm.credentials.NewPassword = null;
				vm.credentials.ConfirmPassword = null;
			});
	};
}
