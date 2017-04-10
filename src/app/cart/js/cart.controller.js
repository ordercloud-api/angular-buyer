angular.module('orderCloud')
    .controller('CartCtrl', CartController)
;

function CartController($rootScope, $state, toastr, OrderCloudSDK, LineItemsList, CurrentPromotions, ocConfirm) {
    var vm = this;
    vm.lineItems = LineItemsList;
    vm.promotions = CurrentPromotions.Meta ? CurrentPromotions.Items : CurrentPromotions;
    vm.removeItem = function(order, scope) {
        vm.lineLoading = [];
        vm.lineLoading[scope.$index] = OrderCloudSDK.LineItems.Delete('outgoing', order.ID, scope.lineItem.ID)
            .then(function () {
                $rootScope.$broadcast('OC:UpdateOrder', order.ID);
                vm.lineItems.Items.splice(scope.$index, 1);
                toastr.success(scope.lineItem.Product.Name + ' was removed from your shopping cart.');
            });
    };

    //TODO: missing unit tests
    vm.removePromotion = function(order, scope) {
        OrderCloudSDK.Orders.RemovePromotion('outgoing', order.ID, scope.promotion.Code)
            .then(function() {
                $rootScope.$broadcast('OC:UpdateOrder', order.ID);
                vm.promotions.splice(scope.$index, 1);
            });
    };

    vm.cancelOrder = function(order){
        ocConfirm.Confirm({
                message:'Are you sure you want to cancel this order?',
                confirmText: 'Yes, cancel order',
                type: 'delete'})
            .then(function() {
                OrderCloudSDK.Orders.Delete('outgoing', order.ID)
                    .then(function(){
                        $state.go('home', {}, {reload:'base'});
                    });
            });
    };

    //TODO: missing unit tests
    $rootScope.$on('OC:UpdatePromotions', function(event, orderid) {
        OrderCloudSDK.Orders.ListPromotions('outgoing', orderid)
            .then(function(data) {
                if (data.Meta) {
                    vm.promotions = data.Items;
                } else {
                    vm.promotions = data;
                }
            });
    });
}