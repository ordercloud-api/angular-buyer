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
            if(scope.buyer.xp && scope.buyer.xp.Images && scope.buyer.xp.Images.length) {
                scope.interval = 5000;
                scope.noWrapSlides = false;
                scope.active = 0;
                element.html(
                    "<uib-carousel active='active' interval='interval' no-wrap='noWrapSlides'>" +
                        "<uib-slide ng-repeat='slide in buyer.xp.Images track by slide.ID' index='$index'>" +
                            "<img class='img-responsive' ng-src='{{slide.Src}}'>" +
                            "<div class='carousel-caption'>" +
                                "<h4>Slide {{slide.ID}}</h4>" +
                                "<p>{{slide.Text}}</p>" +
                            "</div>" +
                        "</uib-slide>" +
                    "</uib-carousel>"
                );
                $compile(element.contents())(scope);
            }
        }
    }
}