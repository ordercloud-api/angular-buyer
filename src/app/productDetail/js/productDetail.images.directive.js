angular.module('orderCloud')
    .directive('ocProductImages', ocProductImages);

function ocProductImages() {
    return {
        scope: {
            product: '='
        },
        restrict: 'E',
        templateUrl: 'productDetail/templates/productDetail.images.html',
        controller: function($scope, $timeout) {
            var responsiveOpts = [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 425,
                    settings: {
                        slidesToShow: 2
                    }
                }
            ]
            var slickOpts = {
                arrows: true,
                infinite: false,
                responsive: responsiveOpts
            }
            $scope.carouselLoading = $timeout(function() {
                var slick = $('#ImageCarousel');
                slick.slick(slickOpts);
            }, 300);
        }
    }
}