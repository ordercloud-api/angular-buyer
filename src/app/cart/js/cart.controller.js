angular.module('orderCloud')
    .controller('CartCtrl', CartController)
;

function CartController($rootScope, $state, toastr, OrderCloudSDK, LineItemsList, CurrentPromotions, ocConfirm) {
    var vm = this;
    vm.lineItems = LineItemsList;
    vm.promotions = CurrentPromotions.Meta ? CurrentPromotions.Items : CurrentPromotions;
    vm.removeItem = removeItem;
    vm.removePromotion = removePromotion;
    vm.cancelOrder = cancelOrder;

    $rootScope.$on('OC:UpdatePromotions', function(event, orderid) {
        return OrderCloudSDK.Orders.ListPromotions('outgoing', orderid)
            .then(function(data) {
                if (data.Meta) {
                    vm.promotions = data.Items;
                } else {
                    vm.promotions = data;
                }
            });
    });

    function removeItem(order, scope) {
        vm.lineLoading = [];
        vm.lineLoading[scope.$index] = OrderCloudSDK.LineItems.Delete('outgoing', order.ID, scope.lineItem.ID)
            .then(function () {
                $rootScope.$broadcast('OC:UpdateOrder', order.ID);
                vm.lineItems.Items.splice(scope.$index, 1);
                toastr.success(scope.lineItem.Product.Name + ' was removed from your shopping cart.');
            });
    }

    function removePromotion(order, scope) {
        return OrderCloudSDK.Orders.RemovePromotion('outgoing', order.ID, scope.promotion.Code)
            .then(function() {
                $rootScope.$broadcast('OC:UpdateOrder', order.ID);
                vm.promotions.splice(scope.$index, 1);
            });
    }

    function cancelOrder(order){
        return ocConfirm.Confirm({
                message:'Are you sure you want to cancel this order?',
                confirmText: 'Yes, cancel order',
                type: 'delete'})
            .then(function() {
                OrderCloudSDK.Orders.Delete('outgoing', order.ID)
                    .then(function(){
                        $state.go('home', {}, {reload:'base'});
                    });
            });
    }
}