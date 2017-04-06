angular.module('orderCloud')
    .constant('CheckoutConfig', CheckoutConfigConstants())
;

function CheckoutConfigConstants() {
    var constants = {
        ShippingRates: true,
        TaxRates: false,
        AvailablePaymentMethods: ['PurchaseOrder', 'CreditCard', 'SpendingAccount']
    };

    return constants;
}