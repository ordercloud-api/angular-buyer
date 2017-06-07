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
        controller: function($scope, $timeout) {
            var slickElement, slickOptions;
            this.$onInit = function() {
                $scope.loading = true;
                $scope.elementID = generateElementID();
                
                var defaultSlidesToShow = 6;
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

                slickOptions = angular.extend(defaultOptions, $scope.options || {});

                //Generates a random ID to be used by the .c-product-carousel element 
                //unique IDs are needed for multiple <oc-product-carousel></oc-product-carousel> on a single page
                function generateElementID() {
                    var S4 = function() {
                        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                    };
                    return (S4()+'_'+S4());
                }
                
                function _initializeCarousel() {

                    //Store the slick element
                    slickElement = $('#' + $scope.elementID);

                    //After the slick element is initialized, set loading to false to show the directive
                    slickElement.on('init', function(slick) {
                        $scope.loading = false;
                    });

                    //Initiate the slick carousel with the merged slick options object
                    slickElement.slick(slickOptions);
                }

                if ($scope.products && $scope.products.Items.length) {
                    $scope.carouselLoading = $timeout(_initializeCarousel, 300);
                } else {
                    //If there are no products available, do not initialize the slick carousel.
                    $scope.loading = false;
                }
            };
        }
    };
}