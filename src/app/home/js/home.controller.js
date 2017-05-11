angular.module('orderCloud')
	.controller('HomeCtrl', HomeController)
;

function HomeController(ocFeaturedProductsService) {
	var vm = this;

	vm.featured = function() {
		ocFeaturedProductsService.List();
	}
}