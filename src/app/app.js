angular.module( 'orderCloud', [
	'templates-app',
	'ngSanitize',
	'ngAnimate',
	'ui.router',
	'ngMessages',
	'ngTouch',
	'orderCloud.sdk',
	'orderCloud.home'
])

	.config( Routing )
	.config( ErrorHandling )
	.controller( 'AppCtrl', AppCtrl )

;

function AppCtrl( $scope ) {
	$scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState, fromParams ){
		if ( angular.isDefined( toState.data.pageTitle ) ) {
			$scope.pageTitle = 'OrderCloud | ' + toState.data.pageTitle;
		}
	});
}

function Routing( $urlRouterProvider ) {
	$urlRouterProvider.otherwise( '/home' );
	//$locationProvider.html5Mode(true);
	/*TODO: we will want html5Mode to be on; however, to do this, we also need to dynamically set a <base> tag in the index.html*/
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