angular.module('orderCloud')
	.config(HomeConfig)
	.controller('HomeCtrl', HomeController)
;

function HomeConfig($stateProvider) {
	$stateProvider
		.state('home', {
			parent: 'base',
			url: '/home',
			templateUrl: 'home/templates/home.tpl.html',
			controller: 'HomeCtrl',
<<<<<<< HEAD
			controllerAs: 'home'
=======
			controllerAs: 'home',
			data: {
				pageTitle: 'Home'
			}
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
		})
	;
}

function HomeController() {
	var vm = this;
}
