angular.module('orderCloud')
    .factory('ocAuthNet', AuthorizeNet)
;

function AuthorizeNet( $q, $resource, OrderCloudSDK, apiurl, ocCreditCardUtility) {
    return {
        'CreateCreditCard': _createCreateCard,
        'UpdateCreditCard': _updateCreditCard,
        'DeleteCreditCard' : _deleteCreditCard,
        'MakeAuthnetCall' : _makeApiCall

    };

    function _createCreateCard(creditCard, buyerID) {
        var ExpirationDate = ocCreditCardUtility.ExpirationDateFormat(creditCard.ExpirationMonth, creditCard.ExpirationYear);
        return _makeApiCall('POST', {
            'buyerID' : buyerID,
            'TransactionType' : 'createCreditCard',
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
        var ExpirationDate = ocCreditCardUtility.ExpirationDateFormat(creditCard.ExpirationMonth, creditCard.ExpirationYear);
        return _makeApiCall('POST', {
            'buyerID' : buyerID,
            'TransactionType' : 'updateCreditCard',
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
        return _makeApiCall('POST', {
            'buyerID': buyerID,
            'TransactionType': 'deleteCreditCard',
            'CardDetails': {
                'CreditCardID': creditCard.ID
            }
        });
    }

    function _makeApiCall(method, requestBody) {
        var apiUrl = apiurl +'/v1/integrationproxy/authorizenettest';
        var d = $q.defer();
        $resource(apiUrl, null, {
            callApi: {
                method: method,
                headers: {
                    'Authorization': 'Bearer ' + OrderCloudSDK.GetToken()
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