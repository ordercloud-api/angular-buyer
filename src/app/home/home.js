angular.module( 'orderCloud' )

	.config( HomeConfig )
	.controller( 'HomeCtrl', HomeController )

;

function HomeConfig( $stateProvider ) {
	$stateProvider
		.state( 'base.home', {
			url: '/home',
			templateUrl:'home/templates/home.tpl.html',
			controller:'HomeCtrl',
			controllerAs: 'home'
		})
}

function HomeController( appname ) {
	var vm = this;
	vm.appName = appname;
}
