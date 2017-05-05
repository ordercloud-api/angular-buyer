angular.module('orderCloud')
    .directive('ocPreventClick', OrderCloudPreventClickDirective)
;

function OrderCloudPreventClickDirective(){
    return {
        link: function($scope, element) {
            element.on("click", function(e){
                e.stopPropagation();
            });
        }
    };
}