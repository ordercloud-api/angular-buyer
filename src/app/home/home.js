angular.module( 'orderCloud' )

	.config( HomeConfig )
	.controller( 'HomeCtrl', HomeController )

;

function HomeConfig( $stateProvider ) {
	$stateProvider.state( 'home', {
		url: '/home',
		templateUrl:'home/templates/home.tpl.html',
		controller:'HomeCtrl',
		data:{ pageTitle: 'Home' }
	});
}

function HomeController( $scope ) { }
