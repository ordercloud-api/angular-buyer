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
                    $state.go('productSearchResults', {search: data.search});
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

    $rootScope.$on('OC:UpdateTotalQuantity', function(event, lineItems, add, difference) {
        if (lineItems.length >= 1) {
            var quantities = _.pluck(lineItems, 'Quantity');
            vm.totalQuantity = quantities.reduce(function(a, b) {return a + b}, 0);
        } else {
            var li = lineItems[0] || lineItems;
            if (vm.totalQuantity) {
                if (add) {
                    var newQuantity = difference ? difference : li.Quantity;
                    vm.totalQuantity = newQuantity + vm.totalQuantity || 0;
                } else {
                    var newQuantity = difference ? difference : li.Quantity;
                    vm.totalQuantity = vm.totalQuantity - newQuantity || 0;
                }
            } else {
                vm.totalQuantity = li.Quantity || 0;
            }
        }  
    })
}