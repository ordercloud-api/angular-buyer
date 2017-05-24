angular.module('orderCloud')
	.controller('HomeCtrl', HomeController)
;

function HomeController(Buyer) {
	var vm = this;
	vm.buyer = Buyer;

	vm.slides = [
		{
			Src: 'src/assets/images/carousel1.jpg', 
			Title: 'Carousel Image One',
			SubText: 'This is the first image',
			ID: 0
		},
		{
			Src: 'src/assets/images/carousel2.jpg',
			Title: 'Carousel Image Two',
			SubText: 'This is the second image',
			ID: 1
		},
		{
			Src: 'src/assets/images/carousel3.jpg',
			Title: 'Carousel Image Three',
			SubText: 'This is the third image',
			ID: 2
		},
		{
			Src: 'src/assets/images/carousel4.jpg',
			Title: 'Carousel Image Four',
			SubText: 'This is the fourth image',
			ID: 3
		},
		{
			Src: 'src/assets/images/carousel5.jpg',
			Title: 'Carousel Image Five',
			SubText: 'This is the fifth image',
			ID: 4
		},
		{
			Src: 'src/assets/images/carousel6.jpg',
			Title: 'Carousel Image Six',
			SubText: 'This is the sixth image',
			ID: 5
		},
	]
}