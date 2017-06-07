angular.module('orderCloud')
    .controller('BaseCtrl', BaseController)
;

function BaseController($scope, $state, OrderCloudSDK, ocProducts, CurrentUser, CurrentOrder, TotalQuantity, $log) {
    var vm = this;
    vm.currentUser = CurrentUser;
    vm.currentOrder = CurrentOrder;
    vm.totalQuantity = TotalQuantity;

    vm.mobileSearch = mobileSearch;
    vm.updateLineItemQuantities = updateLineItemQuantities;

    function mobileSearch() {
        return ocProducts.Search(CurrentUser.Buyer.DefaultCatalogID)
            .then(function(data) {
                if (data.productID) {
                    $state.go('productDetail', {productid: data.productID});
                } else {
                    $state.go('productBrowse.products', {
                        catalogid: CurrentUser.Buyer.DefaultCatalogID,
                        search: data.search,
                        categoryid: ''
                    });
                }
            });
    }

    $scope.$on('OC:UpdateOrder', function(event, orderID, updateLI) {
        vm.orderLoading = {
            message: 'Updating Order'
        };
        if(updateLI && typeof updateLI.lineItems !== 'undefined') updateLineItemQuantities(updateLI);
        vm.orderLoading.promise = OrderCloudSDK.Orders.Get('outgoing', orderID)
            .then(function(order) {
                vm.currentOrder = order;
            });
    });

    function updateLineItemQuantities(updateObj){
                
        /**
         * @param updateObj.lineItems - lineItem(s) to update, provide all or one to update
         * @param userInfo.add (boolean) determines whether to add to running total
         * @param userInfo.subtract (boolean) determines whether to subtract from running total
         */

        if(updateObj.lineItems.length > 1) {
            //calculates total assuming all line items are provided
            var quantities = _.pluck(updateObj.lineItems, 'Quantity');
            vm.totalQuantity = quantities.reduce(function(a, b) {return a + b;}, 0);
        } else {
            //lineItems is a single value that wil be added or subtracted from total
            var li = updateObj.lineItems[0] || updateObj.lineItems;

            if(updateObj.add){
                vm.totalQuantity += li.Quantity;
            } else if(updateObj.subtract) {
                vm.totalQuantity -= li.Quantity || 0;
            } else {
                $log.error('When updating a single line item, add or remove must be included in updateObject');
            }
        }
    }
}