angular.module('orderCloud')
    .factory('ocProductSearch', OrderCloudProductSearchService)
;

function OrderCloudProductSearchService($uibModal) {
    var service = {
        Open:_open
    };

    function _open() {
        return $uibModal.open({
            backdrop:'static',
            templateUrl:'productSearch/templates/productSearch.modal.html',
            controller: 'ProductSearchModalCtrl',
            controllerAs: '$ctrl',
            size: '-full-screen c-productsearch-modal'
        }).result;
    }

    return service;
}