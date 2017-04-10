angular.module('orderCloud')
    .directive('ocSpecSelectField', OrderCloudSpecSelectFieldDirective)
;

// this directive makes it so that when an option selected ,  it checks that option selected to see if it has an  openFieldText so that an input will appear so user can enter value.
function OrderCloudSpecSelectFieldDirective() {
    return {
        scope: {
            spec: '='
        },
        templateUrl: 'productDetail/templates/specSelectField.html',
        link: function(scope) {
            if(scope.spec.DefaultOptionID) scope.spec.OptionID = scope.spec.DefaultOptionID;
            scope.showField = false;
            scope.$watch(function() {
                return scope.spec.OptionID;
            }, function(newVal, oldVal) {
                if (!newVal) return;
                var selectedOption = _.findWhere(scope.spec.Options, {ID : newVal});
                scope.showField= selectedOption.IsOpenText;
            });
        }
    };
}