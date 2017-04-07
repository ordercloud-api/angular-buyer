angular.module('orderCloud')
	.controller('CheckoutCtrl', CheckoutController)
;

function CheckoutController($state, $rootScope, toastr, sdkOrderCloud, OrderShipAddress, CurrentPromotions, OrderBillingAddress, CheckoutConfig) {
    var vm = this;
    vm.shippingAddress = OrderShipAddress;
    vm.billingAddress = OrderBillingAddress;
    vm.promotions = CurrentPromotions.Items;
    vm.checkoutConfig = CheckoutConfig;

    vm.submitOrder = function(order) {
        sdkOrderCloud.Orders.Submit('outgoing', order.ID)
            .then(function(order) {
                $state.go('confirmation', {orderid:order.ID}, {reload:'base'});
                toastr.success('Your order has been submitted', 'Success');
            })
            .catch(function(ex) {
                toastr.error('Your order did not submit successfully.', 'Error');
            });
    };

    $rootScope.$on('OC:OrderShipAddressUpdated', function(event, order) {
        sdkOrderCloud.Me.GetAddress(order.ShippingAddressID)
            .then(function(address){
                vm.shippingAddress = address;
            });
    });

    $rootScope.$on('OC:OrderBillAddressUpdated', function(event, order){
        sdkOrderCloud.Me.GetAddress(order.BillingAddressID)
            .then(function(address){
                vm.billingAddress = address;
            });
    });

    vm.removePromotion = function(order, promotion) {
        sdkOrderCloud.Orders.RemovePromotion('outgoing', order.ID, promotion.Code)
            .then(function() {
                $rootScope.$broadcast('OC:UpdatePromotions', order.ID);
            })
    };

    $rootScope.$on('OC:UpdatePromotions', function(event, orderid) {
        sdkOrderCloud.Orders.ListPromotions('outgoing', orderid)
            .then(function(data) {
                if (data.Meta) {
                    vm.promotions = data.Items;
                } else {
                    vm.promotions = data;
                }
                $rootScope.$broadcast('OC:UpdateOrder', orderid);
            })
    });
}