angular.module( 'orderCloud', [
	'templates-app',
	'templates-common',
	'orderCloud.home',
	'ui.router'
])

	.config(Routing)
	.config(ErrorHandling)
	.constant('appname', 'oc')
	.controller( 'AppCtrl', AppCtrl)

;

function AppCtrl($scope, $location) {
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		if ( angular.isDefined( toState.data.pageTitle ) ) {
			$scope.pageTitle = 'OrderCloud | ' + toState.data.pageTitle;
		}
	});
}

function Routing($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise( '/home' );
}

function ErrorHandling($provide) {
	$provide.decorator('$exceptionHandler', handler);

	function handler($delegate, $injector) {
		return function $broadcastingExceptionHandler(ex, cause) {
			ex.status != 500 ?
				$delegate(ex, cause) :
				(function() {
					try {
						//TODO: implement track js
						console.log(JSON.stringify(ex));
						//trackJs.error("API: " + JSON.stringify(ex));
					}
					catch (x) {
						console.log(JSON.stringify(ex));
					}
				})();
			$injector.get('$rootScope').$broadcast('exception', ex, cause);
		}
	}
}