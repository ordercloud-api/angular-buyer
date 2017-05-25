angular.module('orderCloud')
	.controller('HomeCtrl', HomeController)
;

function HomeController(Buyer) {
	var vm = this;
	vm.buyer = Buyer;

	vm.slides = [
		{
			Src: 'assets/images/carousel1.jpg', 
			Title: 'Carousel Image One',
			SubText: 'This is the first image',
			ID: 0
		},
		{
			Src: 'assets/images/carousel2.jpg',
			Title: 'Carousel Image Two',
			SubText: 'This is the second image',
			ID: 1
		},
		{
			Src: 'assets/images/carousel3.jpg',
			Title: 'Carousel Image Three',
			SubText: 'This is the third image',
			ID: 2
		}
	]
}