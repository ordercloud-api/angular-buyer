angular.module('orderCloud')
    .directive('ocProductImages', ocProductImagesDirective)
;

function ocProductImagesDirective($compile, $templateRequest, $exceptionHandler) {
    return {
        scope: {
            product: '='
        },
        restrict: 'E',
        link: function(scope, element) {
            scope.responsive = [
                {
                    breakpoint: 1500,
                    settings: {
                        slidesToShow: 4
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }                            
            ];
            element.html(
                "<slick class='slider-main' infinite='false' slides-to-show='1' slides-to-scroll='1' arrows='false' fade='true' as-nav-for='.slider-nav'>" +
                    "<div ng-repeat='image in product.xp.Images' index='$index'>" +
                        "<img src='http://via.placeholder.com/400x400' />" +
                    "</div>" +
                "</slick>" +
                "<br>" +
                "<slick class='slider-nav' responsive='responsive' slides-to-show='3' slides-to-scroll='1' arrows='!application.isTouchDevice' focus-on-select='true' as-nav-for='.slider-main'>" +
                    "<div ng-repeat='images in product.xp.Images' index='$index'>" +
                        "<img src='http://placehold.it/100X100' />" +
                    "</div>" + 
                "</slick>"
            );
            $compile(element.contents())(scope);
        }
    }
}