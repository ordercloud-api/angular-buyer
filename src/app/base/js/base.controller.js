angular.module('orderCloud')
    .controller('BaseCtrl', BaseController)
;

function BaseController($rootScope, $state, sdkOrderCloud, ocProductSearch, CurrentUser, CurrentOrder) {
    var vm = this;
    vm.currentUser = CurrentUser;
    vm.currentOrder = CurrentOrder;

    vm.mobileSearch = function() {
        ocProductSearch.Open()
            .then(function(data) {
                if (data.productID) {
                    $state.go('productDetail', {productid: data.productID});
                } else {
                    $state.go('productSearchResults', {searchTerm: data.searchTerm});
                }
            });
    };

    $rootScope.$on('OC:UpdateOrder', function(event, OrderID, message) {
        vm.orderLoading = {
            message: message
        };
        vm.orderLoading.promise = sdkOrderCloud.Orders.Get('outgoing', OrderID)
            .then(function(data) {
                vm.currentOrder = data;
            });
    });
}