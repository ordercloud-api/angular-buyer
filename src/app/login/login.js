angular.module( 'orderCloud' )

	.config( LoginConfig )
	.controller( 'LoginCtrl', LoginController )

;

function LoginConfig( $stateProvider ) {
	$stateProvider.state( 'login', {
		url: '/login',
		templateUrl:'login/templates/login.tpl.html',
		controller:'LoginCtrl',
		controllerAs: 'login',
		data:{
			limitAccess: false //Whether or not to require authentication on this state
		}
	});
}

function LoginController( $state, Credentials ) {
	var vm = this;

	vm.submit = function( ) {
		Credentials.Get( vm.credentials ).then(
			function() {
				$state.go( 'base.home' );
			}).catch(function( ex ) {
				console.dir( ex );
			});
	};
}
