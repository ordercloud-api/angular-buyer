angular.module( 'orderCloud' )

	.config( BaseConfig )
	.controller( 'BaseCtrl', BaseController )
	.controller( 'BaseLeftCtrl', BaseLeftController )
	.controller( 'BaseTopCtrl', BaseTopController )

;

function BaseConfig( $stateProvider ) {
	$stateProvider
		.state( 'base', {
			url: '',
			abstract: true,
			templateUrl:'base/templates/base.tpl.html',
			data:{
				limitAccess: true
			},
			views: {
				'': {
					templateUrl: 'base/templates/base.tpl.html',
					controller: 'BaseCtrl',
					controllerAs: 'base'
				},
				'top@base': {
					templateUrl: 'base/templates/base.top.tpl.html',
					controller: 'BaseTopCtrl',
					controllerAs: 'baseTop'
				},
				'left@base': {
					templateUrl: 'base/templates/base.left.tpl.html',
					controller: 'BaseLeftCtrl',
					controllerAs: 'baseLeft'
				}
			},
			resolve: {
				CurrentUser: function(Me) {
					return Me.Get();
				},
				ComponentList: function($state, $q) {
					var deferred = $q.defer();
					var nonSpecific = ['Products', 'Specs', 'Price Schedules'];
					var components = {
						nonSpecific: [],
						buyerSpecific: []
					};
					angular.forEach($state.get(), function(state) {
						if (!state.data || !state.data.componentName) return;
						if (nonSpecific.indexOf(state.data.componentName) > -1) {
							components.nonSpecific.push({
								Display: state.data.componentName,
								StateRef: state.name
							})
						} else {
							components.buyerSpecific.push({
								Display: state.data.componentName,
								StateRef: state.name
							})
						}
					});
					deferred.resolve(components);
					return deferred.promise;
				}
			}
		});
}

function BaseController( CurrentUser ) {
	var vm = this;
	vm.currentUser = CurrentUser;
}

function BaseLeftController(ComponentList) {
	var vm = this;
	vm.catalogItems = ComponentList.nonSpecific;
	vm.organizationItems = ComponentList.buyerSpecific;
	vm.isCollapsed = true;
}

function BaseTopController() {
	var vm = this;
}