angular.module('orderCloud')
    .controller('MobileCategoryModalCtrl', MobileCategoryModalController)
;

function MobileCategoryModalController($uibModalInstance, TreeConfig){
    var vm = this;
    vm.treeConfig = TreeConfig;

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    vm.selectNode = function(node){
        $uibModalInstance.close(node);
    };
}