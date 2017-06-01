angular.module('orderCloud')
    .directive('ocFeaturedProducts', FeaturedProductsDirective)
;

function FeaturedProductsDirective(ocFeaturedProductsService, $templateRequest, $compile) {
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
                    $templateRequest('common/directives/directives-product-card.html').then(function(html) {
                        var template = angular.element(html);
                        element.append(template);
                        $compile(template)(scope);
                    });
                });
        }
    }
}