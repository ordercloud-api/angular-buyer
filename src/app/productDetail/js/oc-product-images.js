angular.module('orderCloud')
    .directive('ocProductImages', ocProductImagesDirective);

function ocProductImagesDirective($compile, $templateRequest, $exceptionHandler, $timeout) {
    return {
        scope: {
            product: '='
        },
        restrict: 'E',
        link: function (scope, element) {
            scope.responsive = [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ];
            function getTemplate() {$templateRequest('productDetail/templates/oc-product-images.html').then(function(html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
                });
            }
            $timeout(getTemplate(), 100);
        }
    }
}