angular.module('orderCloud')
    .directive('ocReorder', ocReorderDirective)
;

function ocReorderDirective(ocReorder, $exceptionHandler, $compile) {
    return {
        scope: {
            ocReorder: '<',     //required - order id to reorder
            currentOrderId: '<' //optional - slight performance increase if included
        },
        restrict: 'A',
        //priority/terminal ensures there is no unpredictable 
        //behavior when multiple directives are on the same element
        //due to $compile being used within our directive
        priority: 1000,
        terminal: true,
        link: function(scope, element){
            if(typeof scope.ocReorder === 'undefined'){
                $exceptionHandler({message: 'ocReorder directive is not configured correctly, missing previous order id'});
            }
            element.attr('cg-busy', 'loading'); //adds loading indicator to element
            element.removeAttr('oc-reorder'); //remove attr to avoid infinite loop when compiling cg-busy
            $compile(element)(scope); //compile other directives (including cg-busy) 
            element.on('click', function(){
                scope.loading = ocReorder.GetValidLineItems(scope.ocReorder)
                    .then(function(lineItems){
                        return ocReorder.Open(scope.currentOrderId, lineItems);
                    });
            });
        }
    };
}