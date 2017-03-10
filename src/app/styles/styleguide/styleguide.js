angular.module('orderCloud')
	.config(StyleguideConfig)
	.controller('StyleguideCtrl', StyleguideController)
;

function StyleguideConfig($stateProvider) {
	$stateProvider
		.state('styleguide', {
			parent: 'base',
			url: '/styleguide',
			templateUrl: 'styles/styleguide/templates/styleguide.html',
			controller: 'StyleguideCtrl',
			controllerAs: 'styleguide'
		})
	;
}

function StyleguideController() {
	var vm = this;
}
