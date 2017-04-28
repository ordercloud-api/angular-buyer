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

function HomeController() {
	var vm = this;

	vm.slides = [
		{
			id: 0,
			image:'assets/images/Carousel_1.jpg',
			text: 'Slide 1'
		},
		{
			id: 1,
			image:'assets/images/Carousel_2.jpg',
			text: 'Slide 2'
		},
		{
			id: 2,
			image:'assets/images/Carousel_3.jpg',
			text: 'Slide 3'
		},
		{
			id: 3,
			image:'assets/images/Carousel_4.jpg',
			text: 'Slide 4'
		},
		{
			id: 4,
			image:'assets/images/Carousel_5.jpg',
			text: 'Slide 5'
		}
	]
}