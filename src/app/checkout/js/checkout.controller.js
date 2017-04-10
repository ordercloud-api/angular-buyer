angular.module('orderCloud')
	.controller('CheckoutCtrl', CheckoutController)
;

function CheckoutController($exceptionHandler, $state, $rootScope, toastr, OrderCloudSDK, OrderShipAddress, CurrentPromotions, OrderBillingAddress, CheckoutConfig) {
    var vm = this;
    vm.shippingAddress = OrderShipAddress;
    vm.billingAddress = OrderBillingAddress;
    vm.promotions = CurrentPromotions.Items;
    vm.checkoutConfig = CheckoutConfig;

    vm.submitOrder = function(order) {
        OrderCloudSDK.Orders.Submit('outgoing', order.ID)
            .then(function(order) {
                $state.go('confirmation', {orderid:order.ID}, {reload:'base'});
                toastr.success('Your order was successfully submitted.');
            })
            .catch(function(ex) {
                toastr.error('Something went wrong with your order submission.', 'Error');
                $exceptionHandler(ex);
            });
    };

    $rootScope.$on('OC:OrderShipAddressUpdated', function(event, order) {
        OrderCloudSDK.Me.GetAddress(order.ShippingAddressID)
            .then(function(address){
                vm.shippingAddress = address;
            });
    });

    $rootScope.$on('OC:OrderBillAddressUpdated', function(event, order){
        OrderCloudSDK.Me.GetAddress(order.BillingAddressID)
            .then(function(address){
                vm.billingAddress = address;
            });
    });

    vm.removePromotion = function(order, promotion) {
        OrderCloudSDK.Orders.RemovePromotion('outgoing', order.ID, promotion.Code)
            .then(function() {
                $rootScope.$broadcast('OC:UpdatePromotions', order.ID);
            });
    };

    $rootScope.$on('OC:UpdatePromotions', function(event, orderid) {
        OrderCloudSDK.Orders.ListPromotions('outgoing', orderid)
            .then(function(data) {
                if (data.Meta) {
                    vm.promotions = data.Items;
                } else {
                    vm.promotions = data;
                }
                $rootScope.$broadcast('OC:UpdateOrder', orderid);
            });
    });
}