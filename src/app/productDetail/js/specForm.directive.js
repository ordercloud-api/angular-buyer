angular.module('orderCloud')
    .directive('ocSpecForm', OrderCloudSpecFormDirective)
;

function OrderCloudSpecFormDirective(OrderCloudSDK, catalogid) {
    return {
        scope: {
            product: '='
        },
        templateUrl: 'productDetail/templates/specForm.html',
        replace: true,
        link: function(scope){
            if (scope.product.SpecCount > 0) {
                var options = {
                    page: 1,
                    pageSize: 100
                };
                OrderCloudSDK.Me.ListSpecs(catalogid, scope.product.ID, options)
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
    };
}