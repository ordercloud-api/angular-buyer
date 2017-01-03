angular.module('orderCloud')
    .directive('ocSpecForm', OCSpecForm)
    .directive('specSelectField', SpecSelectionDirective)
;

function OCSpecForm(OrderCloud) {
    return {
        scope: {
            product: '='
        },
        templateUrl: 'productDetail/specForm/templates/specForm.tpl.html',
        replace: true,
        link: function(scope){
            if (scope.product.SpecCount > 0) {
                OrderCloud.Me.ListSpecs(scope.product.ID, null, 1, 100)
                    .then(function(data){
                        //go through specs array if there is a default value, set the specValue = default value
                        angular.forEach(data.Items, function(obj, key){
                            obj.DefaultValue && (obj.AllowOpenText == false) ? obj.Value = obj.DefaultValue : angular.noop();
                        });
                        scope.product.Specs=data.Items;
                    });
            } else {
                return null;
            }
        }
    }
}
// this directive makes it so that when an option selected ,  it checks that option selected to see if it has an  openFieldText so that an input will appear so user can enter value.
function SpecSelectionDirective() {
    return {
        scope: {
            spec: '='
        },
        templateUrl: 'productDetail/specForm/templates/specSelectionField.tpl.html',
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