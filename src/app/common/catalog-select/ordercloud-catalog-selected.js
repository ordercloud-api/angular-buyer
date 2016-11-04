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

    //This makes the Catalogs ListAssignments API call, and sets the last parameter to the API Call to
    //get the BuyerID
    OrderCloud.Catalogs.ListAssignments(null, null, null, OrderCloud.BuyerID.Get()).then(function(data){
        //We set this variable to an array so that we can loop through the objects in it in the ForEach fn
        var catalogs = [];
        angular.forEach(data.Items, function(catalogAssignment){
            //data.Items pulls in what's returned from the ListAssignments API call, and then
            //the function makes a Catalogs Get API call to get the ID of the data returned
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


//OrderCloud.Catalogs.ListAssignments(null, null, null, OrderCloud.BuyerID.Get()).then(function(data){
//    var catalogs = [];
//    angular.forEach(data.Items, function(catalogAssignment){
//        OrderCloud.Catalogs.Get(catalogAssignment.CatalogID).then(function(catalog){
//            catalogs.push(catalog);
//        });
//    });
//    vm.CatalogList = catalogs;
//});