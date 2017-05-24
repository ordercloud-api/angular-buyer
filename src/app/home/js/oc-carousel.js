angular.module('orderCloud')
    .directive('ocCarousel', ocCarouselDirective)
;

function ocCarouselDirective($compile) {
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
            element.html(
                "<uib-carousel active='active' interval='interval' no-wrap='noWrapSlides'>" +
                    "<uib-slide ng-repeat='slide in buyer.xp.Slides.Items || slides track by slide.ID' index='$index'>" +
                        "<img class='img-responsive' ng-src='{{slide.Src}}' style='display: inline;'>" +
                        "<div class='carousel-caption'>" +
                            "<h4>{{slide.Title}}</h4>" +
                            "<p>{{slide.SubText}}</p>" +
                        "</div>" +
                    "</uib-slide>" +
                "</uib-carousel>"
            );
            $compile(element.contents())(scope);
        }
    }
}