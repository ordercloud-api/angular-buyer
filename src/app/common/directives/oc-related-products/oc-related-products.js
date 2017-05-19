angular.module('orderCloud')
    .directive('ocRelatedProducts', RelatedProductsDirective)
;

function RelatedProductsDirective(ocRelatedProducts, $compile) {
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
                    .then(function(data){
                        console.log(scope.currentuser);
                        scope.relatedProducts = data.Items;
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
                            "<div ng-repeat='product in relatedProducts'>" +
                            "<div class='c-related-products__card-wrap' ng-include='\"common/directives/oc-related-products/oc-related-products.html\"'></div>" +
                            "</div>" +
                            "</slick>"
                        );
                        $compile(element.contents())(scope);
                    });
            }
        }
    }
}