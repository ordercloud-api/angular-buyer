angular.module('orderCloud')
    .directive('ocProductImages', ocProductImages)
    .controller('ProductImagesModalCtrl', ProductImagesModalCtrl)
;

function ocProductImages() {
    return {
        scope: {
            product: '='
        },
        restrict: 'E',
        templateUrl: 'productDetail/templates/productDetail.images.html',
        controller: function($scope, $timeout, $uibModal) {
            var responsiveOpts = [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 4
                    }
                },
                {
                    breakpoint: 425,
                    settings: {
                        slidesToShow: 3
                    }
                }
            ];
            var slickMainOpts = {
                arrows: false,
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
                asNavFor: '#ImageNav'
            };

            var slickNavOpts = {
                arrows: true,
                infinite: false,
                responsive: responsiveOpts,
                slidesToShow: 5,
                slidesToScroll: 1,
                focusOnSelect: true,
                asNavFor: '#ImageMain'
            };
            $scope.carouselLoading = $timeout(function() {
                var slickMain = $('#ImageMain');
                slickMain.slick(slickMainOpts);

                var slickNav = $('#ImageNav');
                slickNav.slick(slickNavOpts);
            }, 300);

            $scope.openImageModal = function(model, index) {
                if($scope.product.xp.imageZoom) {
                    return $uibModal.open({
                    animation: true,
                    backdrop: true,
                    templateUrl: 'productDetail/templates/productDetail.images.modal.html',
                    controller: 'ProductImagesModalCtrl',
                    controllerAs: 'productImagesModal',
                    size: '-full-screen c-gallery--lightbox',
                    resolve: {
                        Model: function() {
                            return model; 
                        },
                        Index: function() {
                            return index;
                        }
                    }}).result;
                }
            };
        }
    };
}

function ProductImagesModalCtrl(Model, Index, $uibModalInstance) {
    var vm = this;
    vm.additionalImages;
    vm.defaultImage;
    Model.length ? vm.additionalImages = Model : vm.defaultImage = Model;
    vm.index = Index;
    vm.interval = null;
    vm.noWrap = false;

    vm.close = close;

    function close() {
        $uibModalInstance.dismiss();
    }
}