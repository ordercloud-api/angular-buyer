angular.module('orderCloud')
    .directive('ocCarousel', ocCarouselDirective)
;

function ocCarouselDirective($compile) {
    return {
        scope: {
            buyer: '='
        },
        restrict: 'E',
        link: function(scope, element) {
            if(scope.buyer.xp && scope.buyer.xp.Images.Items && scope.buyer.xp.Images.Items.length) {
                scope.interval = scope.buyer.xp.Images.Interval;
                scope.noWrapSlides = scope.buyer.xp.Images.NoWrap;
                scope.active = 0;
                element.html(
                    "<uib-carousel active='active' interval='interval' no-wrap='noWrapSlides'>" +
                        "<uib-slide ng-repeat='slide in buyer.xp.Images.Items track by slide.ID' index='$index'>" +
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
}