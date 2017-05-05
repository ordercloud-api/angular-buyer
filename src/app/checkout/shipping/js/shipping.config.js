angular.module('orderCloud')
    .config(CheckoutShippingConfig)
;

function CheckoutShippingConfig($stateProvider) {
    $stateProvider
        .state('checkout.shipping', {
            url: '/shipping',
            templateUrl: 'checkout/shipping/templates/checkout.shipping.html',
            controller: 'CheckoutShippingCtrl',
            controllerAs: 'checkoutShipping'
        });
}