angular.module('orderCloud')
	.component('ordercloudProductQuickView', OrderCloudProductQuickViewComponent())
	.controller('ProductQuickViewComponentCtrl', ProductQuickViewComponentController)
;

function OrderCloudProductQuickViewComponent(ocProductQuickView) {
    var component = {
		bindings: {
			product: '<',
			currentOrder: '<'
		},
		template: '<i class="fa fa-eye text-primary" ng-click="$ctrl.quickView($ctrl.currentOrder, $ctrl.product)"></i>',
		controller: 'ProductQuickViewComponentCtrl'
	};

    return component;
}

function ProductQuickViewComponentController(ocProductQuickView) {
	this.quickView = function(currentorder, product){
		ocProductQuickView.Open(currentorder, product);
	};
}