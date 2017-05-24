angular.module('orderCloud')
    .directive('ocCarousel', ocCarouselDirective)
;

function ocCarouselDirective($compile, $templateRequest) {
    return {
        scope: {
            buyer: '=',
            slides: '='
        },
        restrict: 'E',
        link: function(scope, element) {
            var buyer = scope.buyer;
            var slides = scope.slides;
            if (buyer.xp && buyer.xp.Slides && buyer.xp.Slides.Items && buyer.xp.Slides.Items.length) {
                console.log(buyer.xp.Slides.Items);
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