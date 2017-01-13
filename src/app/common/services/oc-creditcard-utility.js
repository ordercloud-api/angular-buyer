angular.module('orderCloud')
    .factory('ocCreditCardUtility', CreditCardUtility)
;


function CreditCardUtility() {
    //return the expirationMonth array and its function
    var creditCardUtility = {
        ExpirationMonths: [{
            number: 1,
            string: '01'
        }, {
            number: 2,
            string: '02'
        }, {
            number: 3,
            string: '03'
        }, {
            number: 4,
            string: '04'
        }, {
            number: 5,
            string: '05'
        }, {
            number: 6,
            string: '06'
        }, {
            number: 7,
            string: '07'
        }, {
            number: 8,
            string: '08'
        }, {
            number: 9,
            string: '09'
        }, {
            number: 10,
            string: '10'
        }, {
            number: 11,
            string: '11'
        }, {
            number: 12,
            string: '12'
        }],
        ExpirationYears: [],
        isLeapYear: function leapYear(year) {
            return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
        },
        CreditCardTypes : [
            'MasterCard',
            'American Express',
            'Discover',
            'Visa'
        ]
    };

    function _ccExpireYears() {
        var today = new Date();
        today = today.getFullYear();
        for (var x = today; x < today + 21; x++) {
            creditCardUtility.ExpirationYears.push(x);
        }
        return creditCardUtility.ExpirationYears;
    }

    _ccExpireYears();

    return creditCardUtility;
}
