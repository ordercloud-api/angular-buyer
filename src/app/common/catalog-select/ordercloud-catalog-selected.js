angular.module('ordercloud-catalog-select', {})
    .directive('ordercloudSelectCatalog', SelectCatalogDirective)
    .controller('SelectCatalogCtrl', SelectCatalogController)
;

function SelectCatalogDirective(){
    return {
        scope: {
            align: '@'
        },
        restrict: 'E',
        templateUrl: 'common/catalog-select/templates/catalog-select.tpl.html',
        controller: 'SelectCatalogCtrl',
        controllerAs: 'selectCatalog'
    }
}

function SelectCatalogController($scope, $state, OrderCloud){
    var vm = this;

    vm.align = $scope.align;

    OrderCloud.Catalogs.List().then(function(data){
        vm.CatalogList = data;
    });

    OrderCloud.Catalogs.Get(OrderCloud.CatalogID.Get()).then(function(data){
        vm.selectedCatalog = data;
    });

    vm.ChangeCatalog = function(catalog){
        OrderCloud.Catalog.Get(catalog.ID).then(function(data){
            vm.selectedCatalog = data;
            OrderCloud.CatalogID.Set(data.ID);
            $state.reload($state.current);
        });
    };

    vm.pagingFunction = function(){
        if (vm.CatalogList.Meta.Page <= vm.CatalogList.Meta.TotalPages) {
            OrderCloud.Catalog.List(null, vm.CatalogList.Meta.Page + 1, vm.CatalogList.Meta.PageSize)
                .then(function(data){
                    vm.CatalogList.Meta = data.Meta;
                    vm.CatalogList.Items = [].concat(vm.CatalogList.Items + data.Items);
                });
        }
    }
}