angular.module('orderCloud')
	.service('ocProductQuickView', OrderCloudProductQuickViewService)
;

function OrderCloudProductQuickViewService($uibModal) {
	var service = {
		Open: _open
	};

	function _open(currentOrder, product) {
		return $uibModal.open({
			backdrop:'static',
			templateUrl: 'productQuickView/templates/productQuickView.modal.html',
			controller: 'ProductQuickViewCtrl',
			controllerAs: 'productQuickView',
			size: 'lg',
			animation:false,
			resolve: {
				SelectedProduct: function() {
					return product;
				},
				CurrentOrder: function() {
					return currentOrder;
				}
			}
		}).result
	}

	return service;
}