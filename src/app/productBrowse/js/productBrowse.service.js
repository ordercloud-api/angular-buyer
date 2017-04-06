angular.module('orderCloud')
    .factory('ocProductBrowse', OrderCloudProductBrowseService)
;

function OrderCloudProductBrowseService($uibModal) {
    var service = {
        OpenCategoryModal: _openCategoryModal
    };

    function _openCategoryModal(treeConfig) {
        return $uibModal.open({
            animation: true,
            backdrop:'static',
            templateUrl: 'productBrowse/templates/mobileCategory.modal.html',
            controller: 'MobileCategoryModalCtrl',
            controllerAs: 'mobileCategoryModal',
            size: '-full-screen',
            resolve: {
                TreeConfig: function () {
                    return treeConfig;
                }
            }
        }).result;
    }

    return service;
}