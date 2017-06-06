angular.module('orderCloud')
    .directive('ocProductImages', ocProductImagesDirective);

function ocProductImagesDirective($compile, $templateRequest, $exceptionHandler, $timeout) {
    return {
        scope: {
            product: '='
        },
        restrict: 'E',
        link: function (scope, element) {
            scope.responsive = [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ];
            function getTemplate() {$templateRequest('productDetail/templates/oc-product-images.html').then(function(html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
                });
            }
            $timeout(getTemplate(), 100);
            $("#img_01").ezPlus({gallery:'gal1', cursor: 'pointer', galleryActiveClass: 'active', imageCrossfade: true}); 

            //pass the images to Fancybox
            $("#img_01").bind("click", function(e) {  
            var ez =   $('"#img_01"').data('elevateZoom');	
                $.fancybox(ez.getGalleryList());
            return false;
            });
        }
    }
}