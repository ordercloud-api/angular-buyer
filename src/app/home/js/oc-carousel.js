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
            var repeater;
            if (buyer.xp && buyer.xp.Images && buyer.xp.Images.Items && buyer.xp.Images.Items.length) {
                scope.interval = buyer.xp.Images.Interval;
                scope.noWrapSlides = buyer.xp.Images.NoWrap;
            } else {
                scope.interval = 5000;
                scope.noWrapSlides = false;
            }
            scope.active = 0;
            console.log(scope.slides);
            element.html(
                "<uib-carousel active='active' interval='interval' no-wrap='noWrapSlides'>" +
                    "<uib-slide ng-repeat='slide in buyer.xp.Images.Items || slides track by slide.ID' index='$index'>" +
                        "<img class='img-responsive' ng-src='{{slide.Src}}'>" +
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