angular.module('orderCloud')
    .directive('ocRelatedProducts', RelatedProductsDirective)
;

function RelatedProductsDirective(ocRelatedProducts, $compile, $templateRequest) {
    return {
        scope: {
            product: "=",
            currentuser: "="
        },
        //currentuser is required here because the favorite products directive within the related products template requires it (won't grab from base)
        restrict: 'E',
        link: function(scope, element) {
            if(scope.product && scope.product.xp && scope.product.xp.RelatedProducts){
                ocRelatedProducts.List(scope.product.xp.RelatedProducts)
                    .then(function(products){
                        scope.relatedProducts = products.Items;
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
}