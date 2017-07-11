angular.module('orderCloud')
    .directive('ocBrand', OrderCloudBrandDirective)
;

function OrderCloudBrandDirective(ocAppName, $injector) {
    return {
        restrict: 'E',
        scope: {
            logoUrl: '<',
            brandName: '<'
        },
        templateUrl: 'common/directives/oc-brand/oc-brand.html',
        link: function(scope, element, attrs) {
            if (!scope.logoUrl) {
                try { // If there is no logo-url provided, attempt to find a logourl constant
                    scope.logoUrl = $injector.get('logourl');
                } catch(ex) { // If there is no logourl constant, set scope.logoUrl to null (show the brand name instead)
                    scope.logoUrl = null;
                }
            }
            
            //If there is no brand-name provided, use the appname as the brand name
            if (!scope.brandName) scope.brandName = ocAppName.Watch();

            //If there is a logoUrl, evaluate the appropriate size
            if (scope.logoUrl) {
                _evaluateLogoSize();
            }

            function _evaluateLogoSize() {
                var img = new Image();
                img.onload = function() {
                    var logoWidth,
                        logoHeight,
                        parentNode = element[0].parentNode;
                    if (parentNode.className === 'navbar-brand' && parentNode.clientHeight) {
                        //If the directive is part of a bootstrap navbar, 
                        //calculate the best width to height ratio based on the navbar height (width 12px of padding)
                        logoWidth = ((this.width / this.height * element[0].parentNode.clientHeight) - 12);
                        if (logoWidth > this.width) logoWidth = this.width;
                        logoWidth += 'px';
                    } else {
                        //Default the width and height to the image size
                        logoHeight = this.height + 'px';
                        logoWidth = this.width + 'px';
                    }
                    scope.logoWidth = logoWidth;
                    scope.logoHeight = logoHeight;
                    scope.$apply();
                };
                img.src = scope.logoUrl;
            }
        }
    };
}