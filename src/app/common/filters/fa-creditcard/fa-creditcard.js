angular.module('orderCloud')
    .filter('faCreditCard', faCreditCard)
;

function faCreditCard() {
    return function(type) {
        var result = 'fa-credit-card-alt';
        if (!type) return result;
        switch(type.toLowerCase()) {
            case 'visa':
                result = 'fa-cc-visa';
                break;
            case 'mastercard':
                result = 'fa-cc-mastercard';
                break;
            case 'american express':
                result = 'fa-cc-amex';
                break;
            case 'diners club':
                result = 'fa-cc-diners-club';
                break;
            case 'discover':
                result = 'fa-cc-discover';
                break;
            case 'jcb':
                result = 'fa-cc-jcb';
                break;
            default:
                result = 'fa-credit-card-alt';
        }
        return result;
    }
}