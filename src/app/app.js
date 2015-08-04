angular.module( 'orderCloud', [
	'templates-app',
	'ngSanitize',
	'ngAnimate',
	'ngMessages',
	'ngTouch',
	'ui.router',
	'ui.bootstrap',
	'orderCloud.sdk'
])

	.run( Security )
	.config( Routing )
	.config( ErrorHandling )
	.controller( 'AppCtrl', AppCtrl )
	.constant('ocscope', 'FullAccess')
	.constant('appname', 'OrderCloud AngularJS Seed')
	.constant('clientid', '0e0450e6-27a0-4093-a6b3-d7cd9ebc2b8f') //DISTRIBUTOR
	//.constant('clientid', 'f0976e5c-ed16-443a-98ad-d084c7010e05') //BUYER


	//Test
	 .constant('authurl', 'https://testauth.ordercloud.io/oauth/token')
	 .constant('apiurl', 'https://testapi.ordercloud.io/v1')
;

function Security( $rootScope, $state, Auth ) {
	$rootScope.$on('$stateChangeStart', function(e, to) {
		if (!to.data.limitAccess) return;
		Auth.IsAuthenticated()
			.catch(sendToLogin);

		function sendToLogin() {
			$state.go('login');
		}
	})
}

function Routing( $urlRouterProvider, $urlMatcherFactoryProvider ) {
	$urlMatcherFactoryProvider.strictMode(false);
	$urlRouterProvider.otherwise( '/home' );
	//$locationProvider.html5Mode(true);
	//TODO: For HTML5 mode to work we need to always return index.html as the entry point on the serverside
}

function ErrorHandling( $provide ) {
	$provide.decorator('$exceptionHandler', handler );

	function handler( $delegate, $injector ) {
		return function $broadcastingExceptionHandler( ex, cause ) {
			ex.status != 500 ?
				$delegate( ex, cause ) :
				( function() {
					try {
						//TODO: implement track js
						console.log(JSON.stringify( ex ));
						//trackJs.error("API: " + JSON.stringify(ex));
					}
					catch ( ex ) {
						console.log(JSON.stringify( ex ));
					}
				})();
			$injector.get( '$rootScope' ).$broadcast( 'exception', ex, cause );
		}
	}
}

function AppCtrl( $state, Credentials ) {
	var vm = this;
	vm.logout = function() {
		Credentials.Delete();
		$state.go('login');
	}
}