angular.module('orderCloud')
    .factory('ocAuthNet', AuthorizeNet)
;

function AuthorizeNet( $q, $resource, OrderCloud, apiurl, ocCreditCardUtility) {
    return {
        'CreateCreditCard': _createCreateCard,
        'UpdateCreditCard': _updateCreditCard,
        'DeleteCreditCard' : _deleteCreditCard,
        'MakeAuthnetCall' : _makeApiCall

    };
//if I want to check that the expiration data is formatted correctly. I could make a function that does what it needs to , return it in service then i can check that the functionality works
    //check the api call, make sure it gets sent to the right url and it passes the body that I expect it too


    function _createCreateCard(creditCard, buyerID) {
        var ExpirationDate = ocCreditCardUtility.ExpirationDateFormat(creditCard.ExpirationMonth, creditCard.ExpirationYear);
        return _makeApiCall('POST', {
            'buyerID' : buyerID ? buyerID : OrderCloud.BuyerID.Get(),
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
            'buyerID' : buyerID ? buyerID : OrderCloud.BuyerID.Get(),
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
            'buyerID': buyerID ? buyerID : OrderCloud.BuyerID.Get(),
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
                    'Authorization': 'Bearer ' + OrderCloud.Auth.ReadToken()
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