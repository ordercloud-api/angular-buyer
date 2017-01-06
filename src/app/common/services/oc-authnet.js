angular.module('orderCloud')
    .factory('ocAuthNet', AuthorizeNet)
;

function AuthorizeNet( $q, $resource, OrderCloud) {
    return {
        'CreateCreditCard': _createCreateCard,
        'UpdateCreditCard': _updateCreditCard,
        'DeleteCreditCard' : _deleteCreditCard
        // 'AuthAndCapture' : _authAndCapture

    };

    function _createCreateCard(creditCard, buyerID) {
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
    }

    function _updateCreditCard(creditCard, buyerID) {
        var year = creditCard.ExpirationYear.toString().substring(2,4);
        var ExpirationDate = creditCard.ExpirationMonth.concat(year);

        return makeApiCall('POST',{
            'buyerID' : buyerID ? buyerID : OrderCloud.BuyerID.Get(),
            'TransactionType' : "updateCreditCard",
            'CardDetails' : {
                'CreditCardID' : creditCard.ID,
                'CardholderName' : creditCard.CardholderName,
                'CardType' : creditCard.CardType,
                'CardNumber' : 'XXXX'+ creditCard.PartialAccountNumber,
                'ExpirationDate' : ExpirationDate
            }
        });

    }
    function _deleteCreditCard(creditCard, buyerID) {
        return makeApiCall('POST', {
            'buyerID': buyerID ? buyerID : OrderCloud.BuyerID.Get(),
            'TransactionType': "deleteCreditCard",
            'CardDetails': {
                'CreditCardID': creditCard.ID
            }
        });

    }
    // function _authAndCapture() {
    //
    // }


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