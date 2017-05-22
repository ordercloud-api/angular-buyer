angular.module('orderCloud')
	.controller('HomeCtrl', HomeController)
;

function HomeController(Buyer) {
	var vm = this;
	vm.buyer = Buyer;
}