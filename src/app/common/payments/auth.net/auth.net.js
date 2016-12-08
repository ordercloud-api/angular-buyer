angular.module('ordercloud-payment-authorizeNet', [])
    .factory('AuthorizeNet', AuthorizeNet)
;

function AuthorizeNet( $q, $resource, OrderCloud) {
    return {
        'CreateCreditCard': _createCreateCard,
        'UpdateCreditCard': _updateUpdateCreditCard(),
        'DeleteCreditCard' : _deleteCreditCard(),
        'AuthAndCapture' : _authAndCapture()

    };

    // function _update(orderID, lineItemID, lineItem, buyerID) {
    //     return makeApiCall('PUT', '/v1/buyers/:buyerID/orders/:orderID/lineitems/:lineItemID', {
    //         'buyerID': buyerID ? buyerID : BuyerID().Get(),
    //         'orderID': orderID,
    //         'lineItemID': lineItemID
    //     }, lineItem);
    // }

    function _createCreateCard(creditCard, buyerID) {
          console.log(creditCard);
          var year = creditCard.ExpirationYear.toString().substring(2,4);
            var ExpirationDate = creditCard.ExpirationMonth.concat(year);

        return makeApiCall('POST',{
            'buyerID' : buyerID ? buyerID : OrderCloud.BuyerID.Get(),
            'TransactionType' : "createCreditCard",
            'CardDetails' : {
                'CardholderName' : creditCard.CardholderName,
                'CardType' : creditCard.CardType,
                'CardNumber' : creditCard.CardNumber,
                'ExpirationDate' : ExpirationDate,
                'CardCode' : creditCard.CardCode
            }
        });
        // return  a;
    }

    function _updateUpdateCreditCard() {

    }
    function _deleteCreditCard() {

    }
    function _authAndCapture() {

    }


    function makeApiCall(method, requestBody) {
        var apiUrl = 'https://api.ordercloud.io/v1/integrationproxy/authorizenettest';
        var d = $q.defer();
        $resource(apiUrl, null, {
            callApi: {
                method: method,
                headers: {
                    'Authorization': 'Bearer ' + OrderCloud.Auth.ReadToken()
                }
            }
        }).callApi(requestBody).$promise
            .then(function(data) {
                console.log(data);
                d.resolve(data);
            })
            .catch(function(ex) {
                d.reject(ex);
            });
        return d.promise;
    }
}