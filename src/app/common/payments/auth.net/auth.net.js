angular.module('ordercloud-payment-authorizeNet', [])
    .factory('AuthorizeNet', AuthorizeNet)
;

function AuthorizeNet( $q, $resource) {
    return {
        'CreateCreditCard': _createCreateCard,
        'UpdateCreditCard': _updateUpdateCreditCard(),
        'DeleteCreditCard' : _deleteCreditCard(),
        'AuthAndCapture' : _authAndCapture()

    };

    function _createCreateCard(creditCard) {
          console.log(creditCard);
        // makeApiCall('POST',{} )
        // return  a;
    }

    function _updateUpdateCreditCard() {

    }
    function _deleteCreditCard() {

    }
    function _authAndCapture() {

    }


    function makeApiCall(method, requestBody) {
        var apiUrl = 'https://api.ordercloud.io/v1/nativeintegrationproxy/authorizenet';
        var d = $q.defer();
        $resource(apiUrl, null, {
            callApi: {
                method: method,
                headers: {
                    'Authorization': 'Bearer ' + Auth().ReadToken()
                }
            }
        }).callApi(requestBody).$promise
            .then(function(data) {
                d.resolve(data);
            })
            .catch(function(ex) {
                d.reject(ex);
            });
        return d.promise;
    }
}