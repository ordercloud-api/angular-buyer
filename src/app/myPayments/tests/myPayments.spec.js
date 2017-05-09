describe('Component: myPayments', function() {
    describe('State: myPayments', function() {
        var myPaymentsState;
        beforeEach(function() {
            myPaymentsState = state.get('myPayments');
            spyOn(oc.Me, 'ListCreditCards').and.returnValue(null);
            spyOn(oc.Me, 'ListSpendingAccounts').and.returnValue(null);
        });
        it('should resolve UserCreditCards', function(){
            mock.Parameters = {
                filters: {
                    Editable: true
                }
            };
            injector.invoke(myPaymentsState.resolve.UserCreditCards);
            expect(oc.Me.ListCreditCards).toHaveBeenCalledWith(mock.Parameters);
        });
        it('should resolve UserSpendingAccounts', function() {
            mock.Parameters.filters = {
                RedemptionCode: '!*'
            };
            injector.invoke(myPaymentsState.resolve.UserSpendingAccounts);
            expect(oc.Me.ListSpendingAccounts).toHaveBeenCalledWith(mock.Parameters);
        });
        it('should resolve UserSpendingAccounts', function() {
            mock.Parameters.filters = {
                RedemptionCode: '*'
            };
            injector.invoke(myPaymentsState.resolve.GiftCards);
            expect(oc.Me.ListSpendingAccounts).toHaveBeenCalledWith(mock.Parameters);
        });
    });

    describe('Controller: MyPaymentsController', function() {
        var myPaymentCtrl,
            authNet,
            mockCreditCard,
            mockSpendingAccount,
            mockGiftCard,
            mockCCresponse,
            mockSAresponse,
            mockGCresponse,
            myPaymentCCModal
            ;

        beforeEach(inject(function($controller, ocAuthNet, ocMyCreditCards) {
            authNet = ocAuthNet;
            myPaymentCCModal = ocMyCreditCards;
            mockCreditCard =   {
                "ID": "testCompanyACard",
                "Editable": true,
                "Token": null,
                "DateCreated": "2016-12-07T17:49:28.73+00:00",
                "CardType": "visa",
                "PartialAccountNumber": "123",
                "CardholderName": "CompanyA",
                "ExpirationDate": "2016-02-20T00:00:00+00:00",
                "xp": null
            };
            mockSpendingAccount =  {
                "ID": "1bXwQHDke0SF4LRPzCpDcQ",
                "Name": "Gift Card Expires Next Month",
                "Balance": 20,
                "AllowAsPaymentMethod": true,
                "RedemptionCode": null,
                "StartDate": "2016-12-01T00:00:00+00:00",
                "EndDate": "2017-02-02T00:00:00+00:00",
                "xp": null
            };
            mockGiftCard =  {
                "ID": "1bXwQHDke0SF4LRPzCpDcQ",
                "Name": "Gift Card Expires Next Month",
                "Balance": 20,
                "AllowAsPaymentMethod": true,
                "RedemptionCode": "Hello",
                "StartDate": "2016-12-01T00:00:00+00:00",
                "EndDate": "2017-02-02T00:00:00+00:00",
                "xp": null
            };
            mockCCresponse = {Items:[mockCreditCard]};
            mockSAresponse = {Items:[mockSpendingAccount]};
            mockGCresponse = {Items:[mockGiftCard]};
            myPaymentCtrl = $controller('MyPaymentsCtrl', {
                UserCreditCards : mockCCresponse,
                UserSpendingAccounts : mockSAresponse,
                GiftCards : mockGCresponse,
                ocAuthNet: authNet
            });
            spyOn(toastrService, 'success');
        }));
        it ('should initialize the view model of the controller', function() {
            expect(myPaymentCtrl.personalCreditCards).toEqual(mockCCresponse);
            expect(myPaymentCtrl.personalSpendingAccounts).toEqual(mockSAresponse);
            expect(myPaymentCtrl.giftCards).toEqual(mockGCresponse);
        });
        describe('Create Credit Card', function(){
            beforeEach(function(){
                var df = q.defer();
                df.resolve("NEW_CREDIT_CARD");
                spyOn(myPaymentCCModal, 'Create').and.returnValue(df.promise);
                // spyOn(oc.Payments, 'List').and.returnValue(df.promise);
                myPaymentCtrl.createCreditCard();
            });
            it('should call the create credit card modal and add the new credit card to the view model', function(){
                expect(myPaymentCCModal.Create).toHaveBeenCalled();
                scope.$digest();
                expect(toastrService.success).toHaveBeenCalled();
                expect(myPaymentCtrl.personalCreditCards).toEqual({Items:[mockCreditCard, "NEW_CREDIT_CARD"]});
            });
        });
        describe('Edit a Credit Card', function(){
            beforeEach(function(){
                var df = q.defer();
                df.resolve("EDITED_CREDIT_CARD");
                spyOn(myPaymentCCModal, 'Edit').and.returnValue(df.promise);
                myPaymentCtrl.edit({$index: 0, creditCard:mockCreditCard});
            });
            it('should call the edit credit card modal then replace the old credit card in the array', function(){
                expect(myPaymentCCModal.Edit).toHaveBeenCalled();
                scope.$digest();
                expect(toastrService.success).toHaveBeenCalled();
                expect(myPaymentCtrl.personalCreditCards).toEqual({Items:["EDITED_CREDIT_CARD"]});
            })
        });
    });
});

