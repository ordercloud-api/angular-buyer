angular.module('ordercloud-buyer-select', [])

    .directive('ordercloudSelectBuyer', SelectBuyerDirective)
    .controller('SelectBuyerCtrl', SelectBuyerController)

;

function SelectBuyerDirective() {
    return {
        scope: {},
        restrict: 'E',
        templateUrl: 'common/buyer-select/buyer-select.tpl.html',
        controller: 'SelectBuyerCtrl',
        controllerAs: 'selectBuyer'
    }
}

function SelectBuyerController($state, Buyers, BuyerID) {
    var vm = this,
        page = 1;

    Buyers.List().then(function(data) {
        vm.BuyerList = data;
    });

    Buyers.Get(BuyerID.Get()).then(function(data) {
        vm.selectedBuyer = data;
    });

    vm.ChangeBuyer = function(buyer) {
        Buyers.Get(buyer.ID).then(function(data) {
            vm.selectedBuyer = data;
            BuyerID.Set(data.ID);
            //console.dir($state.current);
            $state.reload($state.current);
        });
    };

    vm.PagingFunction = function() {
        page += 1;
        if (page <= vm.BuyerList.Meta.TotalPages) {
            Buyers.List(null, page, vm.BuyerList.Meta.PageSize)
                .then(function(data) {
                    vm.BuyerList.Meta = data.Meta;
                    vm.BuyerList.Items = [].concat(vm.BuyerList.Items, data.Items);
                });
        }
    }
}
