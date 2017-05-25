angular.module('orderCloud')
    .directive('ocCarousel', ocCarouselDirective)
;

function ocCarouselDirective($compile, $templateRequest, $log) {
    return {
        scope: {
            buyer: '=',
            slides: '=',
            height: '@'
        },
        restrict: 'E',
        link: function(scope, element) {
            var buyer = scope.buyer;
            if(!buyer) {
                $log.error('ocCarousel directive is not configured correctly, missing buyer data');
            } else {
                var slides = (buyer && buyer.xp && buyer.xp.Slides && buyer.xp.Slides.Items && buyer.xp.Slides.Items.length) ? buyer.xp.Slides : null;
                if(!slides && typeof scope.slides === 'undefined') {
                    $log.error('ocCarousel directive is not configured correctly, missing slides data');
                } else {
                    if (buyer.xp && buyer.xp.Slides && buyer.xp.Slides.Items && buyer.xp.Slides.Items.length) {
                        scope.interval = buyer.xp.Slides.Interval;
                        scope.noWrapSlides = buyer.xp.Slides.NoWrap;
                    } else {
                        scope.interval = 5000;
                        scope.noWrapSlides = false;
                    }
                }
            }
            scope.active = 0;
            $templateRequest('common/directives/oc-carousel/oc-carousel.html').then(function(html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
            });
        }
    };
}