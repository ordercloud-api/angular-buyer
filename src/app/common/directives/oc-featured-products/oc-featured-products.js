angular.module('orderCloud')
    .directive('ocFeaturedProducts', FeaturedProductsDirective)
;

function FeaturedProductsDirective(ocFeaturedProductsService, $compile) {
    return {
        restrict: 'E',
        link: function(scope, element) {
            ocFeaturedProductsService.List()
                .then(function(products) {
                    scope.featuredProducts = products;
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
                    var template = 
                        "<slick arrows='!application.isTouchDevice' responsive='responsive' infinite='true' slides-to-show='6' slides-to-scroll='1' class='slider multiple-items' ng-class='{\"has-arrows\": !application.isTouchDevice}'>" +
                            "<h1>hello</h1>" +
                            "<div ng-repeat='product in featuredProducts'>" +
                                "<div class='c-product-card c-related-products__card' ui-sref='productDetail({productid: product.ID})'>" +
                                    "<div class='c-product-card__img-wrap'>" +
                                        "<img class='img-responsive c-product-card__img' ng-src='{{product.xp.image.URL}}' />" +
                                    "</div>" +
                                    "<div class='c-product-card__body'>" +
                                    "<h4 class='c-product-card__name'>{{product.Name}}</h4>" +
                                        "<div class='clearfix'>" +
                                        "<h4 class='c-product-card__price text-primary'>{{product.PriceSchedule.PriceBreaks[0].Price | currency}}</h4>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                        "</slick>";
                    $compile(element.append(template))(scope);
                });
        }
    }
}