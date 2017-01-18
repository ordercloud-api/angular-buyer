describe('Factory: oc-authnet', function(){
    var scope,
        q,
        oc,
        api,
        resource,
        ocAuthNetService,
        ccUtility,
        mockCreditCard,
        mockBuyerID,
        AuthnetMockCC,
        mockReturnedCC
    ;
    beforeEach(module('orderCloud'));
    beforeEach(inject(function ($rootScope, $q, $resource, OrderCloud, apiurl, ocAuthNet, ocCreditCardUtility) {
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloud;
        api = apiurl;
        resource = $resource;
        ocAuthNetService = ocAuthNet;
        ccUtility = ocCreditCardUtility;
        mockCreditCard = {
            ID: 'testCompanyACard',
            Editable: true,
            Token: null,
            DateCreated: '2016-12-07T17:49:28.73+00:00',
            CardType: 'visa',
            PartialAccountNumber: '123',
            CardholderName: 'CompanyA',
            ExpirationMonth: '01',
            ExpirationYear: 2018,
            xp: null
        };
        mockBuyerID = 'fakeID';
        AuthnetMockCC = {
            'buyerID': 'buyerID',
            'TransactionType': 'createCreditCard',
            'CardDetails': {
                'CardholderName': 'CompanyA',
                'CardType': 'visa',
                'CardNumber': 1234567891234567,
                'ExpirationDate': '01/2018',
                'CardCode': '123'
            }
        };
        mockReturnedCC   =   {
            'ID': 'testCompanyACard',
            'Editable': true,
            'Token': null,
            'DateCreated': '2016-12-07T17:49:28.73+00:00',
            'CardType': 'visa',
            'PartialAccountNumber': '123',
            'CardholderName': 'CompanyA',
            'ExpirationDate': '2016-02-20T00:00:00+00:00',
            'xp': null
        };
    }));

    describe('CreateCreditCard', function(){
        beforeEach(function(){
            spyOn(ccUtility, 'ExpirationDateFormat');
            spyOn(oc.BuyerID, 'Get');
        });
        it('should call ocCreditCardUtility ExpirationDateFormat method ', function(){
            ocAuthNetService.CreateCreditCard(mockCreditCard, mockBuyerID );
            expect(ccUtility.ExpirationDateFormat).toHaveBeenCalledWith('01', 2018);
        });
        it('should call OrderCloud.BuyerID Get method, when no buyerID is passed ', function(){
            ocAuthNetService.CreateCreditCard(mockCreditCard, null );
            expect(oc.BuyerID.Get).toHaveBeenCalled();
        });
    });

    describe('UpdateCreditCard', function(){
        beforeEach(function(){
            spyOn(ccUtility, 'ExpirationDateFormat');
            spyOn(oc.BuyerID, 'Get');
        });
        it('should call ocCreditCardUtility ExpirationDateFormat method ', function(){
            ocAuthNetService.UpdateCreditCard(mockCreditCard, mockBuyerID );
            expect(ccUtility.ExpirationDateFormat).toHaveBeenCalledWith('01', 2018);
        });
        it('should call OrderCloud.BuyerID Get method, when no buyerID is passed ', function(){
            ocAuthNetService.UpdateCreditCard(mockCreditCard, null );
            expect(oc.BuyerID.Get).toHaveBeenCalled();
        });
    });

    describe('DeleteCreditCard', function(){
        beforeEach(function(){
            spyOn(oc.BuyerID, 'Get');
        });
        it('should call OrderCloud.BuyerID Get method, when no buyerID is passed ', function(){
            ocAuthNetService.DeleteCreditCard(mockCreditCard, null );
            expect(oc.BuyerID.Get).toHaveBeenCalled();
        });
    });

    describe('MakeAuthnetCall', function(){
        beforeEach(function(){
            var defer = q.defer();
            defer.resolve();
            spyOn(oc.Auth, 'ReadToken').and.returnValue(defer.promise);
            ocAuthNetService.MakeAuthnetCall('POST', AuthnetMockCC );
        });
        it('should call OrderCloud.Auth ReadToken method ', function(){
            expect(oc.Auth.ReadToken).toHaveBeenCalled();
        });
    });
});