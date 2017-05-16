angular.module('orderCloud')
    .constant('CheckoutConfig', CheckoutConfigConstants())
;

function CheckoutConfigConstants() {
    var constants = {
        ShippingRates: true,
        TaxRates: false,
        AllowMultiplePayments: false,
        AvailablePaymentMethods: ['PurchaseOrder', 'CreditCard', 'SpendingAccount']
    };

    return constants;
}