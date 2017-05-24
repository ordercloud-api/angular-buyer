angular.module('orderCloud')
    .directive('ocCarousel', ocCarouselDirective)
;

function ocCarouselDirective($compile, $templateRequest, $exceptionHandler) {
    return {
        scope: {
            buyer: '=',
            slides: '='
        },
        restrict: 'E',
        link: function(scope, element) {
            if(typeof scope.buyer === 'undefined'){
                $exceptionHandler({message: 'ocCarousel directive is not configured correctly, missing buyer object data'});
            }
            if((!scope.buyer) && typeof scope.slides === 'undefined'){
                $exceptionHandler({message: 'ocCarousel directive is not configured correctly, missing slides data'});
            }
            var buyer = scope.buyer;
            if (buyer.xp && buyer.xp.Slides && buyer.xp.Slides.Items && buyer.xp.Slides.Items.length) {
                scope.interval = buyer.xp.Slides.Interval;
                scope.noWrapSlides = buyer.xp.Slides.NoWrap;
            } else {
                scope.interval = 5000;
                scope.noWrapSlides = false;
            }
            scope.active = 0;
            $templateRequest("common/directives/oc-carousel/oc-carousel.html").then(function(html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
            })
        }
    }
}