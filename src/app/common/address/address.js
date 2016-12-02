angular.module('ordercloud-address', [])
    .directive('ordercloudAddressForm', AddressFormDirective)
    .filter('address', AddressFilter)
;

function AddressFormDirective(OCGeography) {
    return {
        restrict: 'E',
        scope: {
            address: '=',
            isbilling: '='
        },
        templateUrl: 'common/address/templates/address.form.tpl.html',
        link: function(scope) {
            scope.countries = OCGeography.Countries;
            scope.states = OCGeography.States;
        }
    };
}

function AddressFilter() {
    return function(address, option) {
        if (!address) return null;
        if (option === 'full') {
            var result = [];
            if (address.AddressName) {
                result.push(address.AddressName);
            }
            result.push((address.FirstName ? address.FirstName + ' ' : '') + address.LastName);
            result.push(address.Street1);
            if (address.Street2) {
                result.push(address.Street2);
            }
            result.push(address.City + ', ' + address.State + ' ' + address.Zip);
            return result.join('<br/>');
        }
        else {
            return address.Street1 + (address.Street2 ? ', ' + address.Street2 : '');
        }
    };
}
