angular.module('orderCloud')
    .filter('humanize', humanize)
    .filter('faCreditCard', faCreditCard)
;

function humanize() {
    return function(string) {
        if (!string) return;

        return string
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, function(str){ return str.toUpperCase(); })
                .trim();
    }
}

function faCreditCard() {
    return function(type) {
        var result = 'fa-credit-card-alt';
        switch(type.toLowerCase()) {
            case 'visa':
                result = 'fa-cc-visa';
                break;
            case 'mastercard':
                result = 'fa-cc-mastercard';
                break;
            case 'amex':
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