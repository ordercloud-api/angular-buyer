angular.module('orderCloud')
	.config(HomeConfig)
;

function HomeConfig($stateProvider) {
	$stateProvider
		.state('home', {
			parent: 'base',
			url: '/home',
			templateUrl: 'home/templates/home.html',
			controller: 'HomeCtrl',
			controllerAs: 'home',
			data: {
				pageTitle: 'Home'
			}
		})
	;
}