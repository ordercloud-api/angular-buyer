angular.module('orderCloud')
    .directive('ocFeaturedProducts', FeaturedProductsDirective)
;

function FeaturedProductsDirective(ocFeaturedProductsService, $compile) {
    return {
        scope: {
            currentuser: "="
        },
        restrict: 'E',
        link: function(scope, element) {
            ocFeaturedProductsService.List()
                .then(function(products) {
                    scope.featuredProducts = products.Items;
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
                        "<slick arrows='!application.isTouchDevice' responsive='responsive' infinite='false' slides-to-show='6' slides-to-scroll='1' class='slider multiple-items' ng-class='{\"has-arrows\": !application.isTouchDevice}'>" +
                        "<div ng-repeat='product in featuredProducts'>" +
                        "<div class='c-related-products__card-wrap' ng-include='\"common/directives/directives-product-card.html\"'></div>" +
                        "</div>" +
                        "</slick>"
                    );
                    $compile(element.contents())(scope);
                });
        }
    }
}