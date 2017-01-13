angular.module('orderCloud')
	.directive('ordercloudLogo', ordercloudLogo)
;

function ordercloudLogo() {
	return {
		templateUrl: 'common/ordercloud-logo/templates/ordercloud-logo.tpl.html',
		replace:true,
		link: function(scope, element, attrs) {
			scope.OrderCloudLogo = {
				'Icon': attrs.icon ? true : false,
				'maxHeight':attrs.height,
				'fillColor': attrs.color,
				'width': attrs.width
			};
		}
	};
}