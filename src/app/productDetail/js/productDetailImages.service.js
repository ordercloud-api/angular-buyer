angular.module('orderCloud')
    .factory('productImagesModal', ProductImagesModal)
    .controller('ProductImagesModalCtrl', ProductImagesModalCtrl);

function ProductImagesModal($uibModal) {
    var service = {
        Open: _open
    }

    function _open(product, index) {
        return $uibModal.open({
                    animation: true,
                    backdrop: true,
                    templateUrl: 'productDetail/templates/productDetailImages.modal.html',
                    controller: 'ProductImagesModalCtrl',
                    controllerAs: 'productImagesModal',
                    size: 'large',
                    resolve: {
                        Product: function() {
                            return product; 
                        },
                        Index: function() {
                            return index;
                        }
                    }
                }).result;
            }

    return service;
}

function ProductImagesModalCtrl(Product, Index, $uibModalInstance) {
    var vm = this;
    vm.product = Product;
    vm.index = Index;
    vm.images = vm.product.xp.Images;
    vm.activeImage = vm.product.xp.Images[vm.index].Large;
    vm.interval = null;
    vm.noWrap = false;

    vm.close = close;

    function close() {
        $uibModalInstance.dismiss();
    }
}