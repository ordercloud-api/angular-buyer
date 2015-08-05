angular.module( 'orderCloud' )

	.config( BaseConfig )
	.controller( 'BaseCtrl', BaseController )

;

function BaseConfig( $stateProvider ) {
	$stateProvider
		.state( 'base', {
			url: '',
			abstract: true,
			templateUrl:'base/templates/base.tpl.html',
			controller:'BaseCtrl',
			controllerAs: 'base',
			data:{
				limitAccess: true //Whether or not to require authentication on this state, this also affects any child states.
				/*TODO: make the '$stateChangeStart event' in _app.js accept a function so users can control the redirect from here.*/
			}
		})
}

function BaseController( ) {
	var vm = this;
}
