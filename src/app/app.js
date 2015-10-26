angular.module( 'orderCloud', [
	'templates-app',
	'ngSanitize',
	'ngAnimate',
	'ngMessages',
	'ngTouch',
	'ui.router',
	'ui.bootstrap',
	'orderCloud.sdk',
	'toastr'
])

	.run( SetBuyerID )
	.run( Security )
	.config( Routing )
	//.config( ErrorHandling )
	.factory('$exceptionHandler', ExceptionHandler)
	.factory('toast', toast)
	.controller( 'AppCtrl', AppCtrl )

	//Constants needed for the OrderCloud AngularJS SDK
	.constant('ocscope', 'FullAccess')
	.constant('appname', 'OrderCloud AngularJS Seed')

	//Client ID for a Registered Distributor or Buyer Company
	.constant('clientid', '6d60154e-8a55-4bd2-93aa-494444e69996')

	//Test Environment
	//.constant('authurl', 'https://testauth.ordercloud.io/oauth/token')
	//.constant('apiurl', 'https://testapi.ordercloud.io')

	.constant('authurl', 'http://core.four51.com:11629/OAuth/Token')
	.constant('apiurl', 'http://core.four51.com:9002')
	.constant('devcenterClientID', '6d60154e-8a55-4bd2-93aa-494444e69996') //Local
;

function SetBuyerID( BuyerID ) {
	BuyerID.Set('xxxx');
}

function Security( $rootScope, $state, Auth ) {
	$rootScope.$on('$stateChangeStart', function(e, to) {
		/*TODO: make the '$stateChangeStart event' accept a function so users can control the redirect from each state's declaration.*/
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

ExceptionHandler.$inject = ['$injector'];

function ExceptionHandler($injector) {
	return function $broadcastingExceptionHandler( ex, cause ) {
		if (ex.data) {
			var toast = $injector.get('toast');
			var msg = ex.data.Errors[0].Message;
			toast.error(msg);
		}
	}
}

function toast(toastr) {
	var service = {
		error: _error
	};

	function _error(msg) {
		toastr.error(msg, 'Error');
	}

	return service;
}

function AppCtrl( $state, Credentials, Users ) {
	var vm = this;
	vm.logout = function() {
		Credentials.Delete();
		$state.go('login');
	};
}