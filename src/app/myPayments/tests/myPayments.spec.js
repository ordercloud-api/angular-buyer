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
            mockCCresponse,
            mockSAresponse,
            mockGCresponse,
            myPaymentCCModal;

        beforeEach(inject(function($controller, ocAuthNet, ocMyCreditCards) {
            authNet = ocAuthNet;
            myPaymentCCModal = ocMyCreditCards;
            mockCCresponse = {Items:[mock.CreditCard]};
            mockSAresponse = {Items:[mock.SpendingAcct]};
            mockGCresponse = {Items:[mock.GiftCard]};
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
                myPaymentCtrl.createCreditCard();
            });
            it('should call the create credit card modal and add the new credit card to the view model', function(){
                expect(myPaymentCCModal.Create).toHaveBeenCalled();
                scope.$digest();
                expect(toastrService.success).toHaveBeenCalled();
                expect(myPaymentCtrl.personalCreditCards).toEqual({Items:[mock.CreditCard, "NEW_CREDIT_CARD"]});
            });
        });
        describe('Edit a Credit Card', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve("EDITED_CREDIT_CARD");
                spyOn(myPaymentCCModal, 'Edit').and.returnValue(defer.promise);
                myPaymentCtrl.edit({$index: 0, creditCard:mock.CreditCard});
            });
            it('should call the edit credit card modal then replace the old credit card in the array', function(){
                expect(myPaymentCCModal.Edit).toHaveBeenCalled();
                scope.$digest();
                expect(toastrService.success).toHaveBeenCalled();
                expect(myPaymentCtrl.personalCreditCards).toEqual({Items:["EDITED_CREDIT_CARD"]});
            })
        });
        describe('Delete a Credit Card', function() {
            beforeEach(function() {
                var defer = q.defer();
                defer.resolve("DELETED_CREDIT_CARD");
                spyOn(ocConfirmService, 'Confirm').and.returnValue(defer.promise);
                spyOn(authNet, 'DeleteCreditCard');
                myPaymentCtrl.delete({$index: 0, creditCard:mock.CreditCard})
            });
            it('should call the ocConfirm, then delete the credit card', function() {
                expect(ocConfirmService.Confirm).toHaveBeenCalled();
                scope.$digest();
                expect(authNet.DeleteCreditCard).toHaveBeenCalledWith(mock.CreditCard);
            })
        })
    });
});

