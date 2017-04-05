angular.module('orderCloud')
    .controller('CartCtrl', CartController)
;

function CartController($rootScope, $state, toastr, sdkOrderCloud, LineItemsList, CurrentPromotions, ocConfirm) {
    var vm = this;
    vm.lineItems = LineItemsList;
    vm.promotions = CurrentPromotions.Meta ? CurrentPromotions.Items : CurrentPromotions;
    vm.removeItem = function(order, scope) {
        vm.lineLoading = [];
        vm.lineLoading[scope.$index] = OrderCloud.LineItems.Delete(order.ID, scope.lineItem.ID)
            .then(function () {
                $rootScope.$broadcast('OC:UpdateOrder', order.ID);
                vm.lineItems.Items.splice(scope.$index, 1);
                toastr.success('Line Item Removed');
            });
    };

    //TODO: missing unit tests
    vm.removePromotion = function(order, scope) {
        sdkOrderCloud.Orders.RemovePromotion('outgoing', order.ID, scope.promotion.Code)
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
                sdkOrderCloud.Orders.Delete('outgoing', order.ID)
                    .then(function(){
                        $state.go("home",{}, {reload:'base'})
                    });
            });
    };

    //TODO: missing unit tests
    $rootScope.$on('OC:UpdatePromotions', function(event, orderid) {
        sdkOrderCloud.Orders.ListPromotions('outgoing', orderid)
            .then(function(data) {
                if (data.Meta) {
                    vm.promotions = data.Items;
                } else {
                    vm.promotions = data;
                }
            });
    });
}