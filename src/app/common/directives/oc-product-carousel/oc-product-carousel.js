angular.module('orderCloud')
    .directive('ocProductCarousel', OrderCloudProductCarouselDirective)
;

function OrderCloudProductCarouselDirective() {
    return {
        scope: {
            title: '@',
            products: '<',
            options: '<' //All options available at http://kenwheeler.github.io/slick/#settings
        },
        restrict: 'E',
        templateUrl: 'common/directives/oc-product-carousel/oc-product-carousel.html',
        controller: function($scope, $element, $timeout) {
            this.$onInit = function() {
                var defaultSlidesToShow = 6;
                var initializing = true;
                var defaultResponsiveOptions = [
                    {
                        breakpoint: 1500,
                        settings: {
                            slidesToShow: defaultSlidesToShow
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 5
                        }
                    },
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
                ];

                var defaultOptions = {
                    arrows: true,
                    dots: $scope.products ? (defaultSlidesToShow < $scope.products.length) : false,
                    infinite: false,
                    responsive: defaultResponsiveOptions,
                    slidesToShow: defaultSlidesToShow
                };
                var slickOptions = angular.extend(defaultOptions, $scope.options || {});
                $scope.carouselLoading = $timeout(function() {
                    var slickElement = $('#ProductCarousel');
                    slickElement.on('init', function() {
                        initializing = false;
                    })
                    slickElement.slick(slickOptions);
                }, 300);
            }
        }
    }
}