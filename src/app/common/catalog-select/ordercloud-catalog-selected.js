angular.module('ordercloud-catalog-select', [])
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

    //DON'T DELETE
    //OrderCloud.Catalogs.List().then(function(data){
    //    vm.CatalogList = data;
    //});



    //vm.buyerID = {
    //    buyerID: OrderCloud.BuyerID.Get()
    //};
    //
    //OrderCloud.Catalogs.ListAssignments(null, null, null, vm.buyerID).then(function(data){
    //    vm.CatalogList = data;
    //});

    //OrderCloud.BuyerID.Get(OrderCloud.Catalogs.ListAssignments()).then(function(data){
    //    vm.assignedCatalogs = data;
    //});

    //OrderCloud.BuyerID.Get().then(function(data){
    //    OrderCloud.Catalogs.ListAssignments();
    //        vm.assignedCatalogs = data;
    //});

    //vm.AssignedCatalogs = function(assignment){
    //  return OrderCloud.BuyerID.Get(OrderCloud.Catalogs.ListAssignments(assignment.ID))
    //      .then(function(data){
    //          vm.CatalogList = data;
    //      })
    //};

    OrderCloud.Catalogs.ListAssignments(null, null, null, OrderCloud.BuyerID.Get()).then(function(data){
        var catalogs = [];
        angular.forEach(data.Items, function(catalogAssignment){
            OrderCloud.Catalogs.Get(catalogAssignment.CatalogID).then(function(catalog){
                catalogs.push(catalog);
            });
        });
        vm.CatalogList = catalogs;
    });

    vm.selectedCatalog = OrderCloud.CatalogID.Get();

    vm.ChangeCatalog = function(catalog){
        OrderCloud.Catalogs.Get(catalog.ID).then(function(data){
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