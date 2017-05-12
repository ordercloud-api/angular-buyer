angular.module('orderCloud')
    .controller('BaseCtrl', BaseController)
;

function BaseController($rootScope, $state, OrderCloudSDK, ocProductSearch, ocLineItems, CurrentUser, CurrentOrder, TotalQuantity) {
    var vm = this;
    vm.currentUser = CurrentUser;
    vm.currentOrder = CurrentOrder;
    vm.totalQuantity = TotalQuantity;

    vm.mobileSearch = mobileSearch;

    function mobileSearch() {
        return ocProductSearch.Open()
            .then(function(data) {
                if (data.productID) {
                    $state.go('productDetail', {productid: data.productID});
                } else {
                    $state.go('productSearchResults', {searchTerm: data.searchTerm});
                }
            });
    }

    $rootScope.$on('OC:UpdateOrder', function(event, OrderID, message) {
        vm.orderLoading = {
            message: message
        };
        vm.orderLoading.promise = OrderCloudSDK.Orders.Get('outgoing', OrderID)
            .then(function(order) {
                vm.currentOrder = order;
            });
    });

    $rootScope.$on('OC:UpdateTotalQuantity', function(event, lineItem) {
        if (vm.totalQuantity) {
            return vm.totalQuantity = lineItem.Quantity + vm.totalQuantity;
        } else {
            return vm.totalQuantity = lineItem.Quantity;
        }
    })
}