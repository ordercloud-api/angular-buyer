describe('Component: myPayments', function() {
    var scope,
        q,
        oc;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope, OrderCloud) {
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloud;
    }));

    describe('State: myPayments', function() {
        var state;
        beforeEach(inject(function($state) {
            state = $state.get('myPayments');
            spyOn(oc.Me, 'ListCreditCards').and.returnValue(null);
            spyOn(oc.Me, 'ListSpendingAccounts').and.returnValue(null);
        }));
        it('should resolve UserCreditCards', inject(function($injector){
            $injector.invoke(state.resolve.UserCreditCards);
            expect(oc.Me.ListCreditCards).toHaveBeenCalledWith(null, null, null, null, null,{'Editable': true});
        }));
        it('should resolve UserSpendingAccounts', inject(function($injector) {
            $injector.invoke(state.resolve.UserSpendingAccounts);
            expect(oc.Me.ListSpendingAccounts).toHaveBeenCalledWith(null, null, null, null, null, {'RedemptionCode': '!*'});
        }));
        it('should resolve UserSpendingAccounts', inject(function($injector) {
            $injector.invoke(state.resolve.GiftCards);
            expect(oc.Me.ListSpendingAccounts).toHaveBeenCalledWith(null, null, null, null, null, {'RedemptionCode': '*'});
        }));
    });

    describe('Controller: MyPaymentsController', function() {
        var myPaymentCtrl,
            state,
            toaster,
            exceptionHandler,
            confirm,
            creditCardModal,
            authNet,
            mockCreditCard
        ;

        beforeEach(inject(function($controller, $q, $state, toastr, $exceptionHandler, ocConfirm, ocAuthNet, MyPaymentCreditCardModal) {
            state = $state;
            toaster = toastr;
            exceptionHandler = $exceptionHandler;
            confirm = ocConfirm;
            authNet = ocAuthNet;
            mockCreditCard =   {
                "ID": "testCompanyACard",
                "Editable": false,
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
            creditCardModal = MyPaymentCreditCardModal;
            myPaymentCtrl = $controller('MyPaymentsCtrl', {
                $scope : scope,
                $state : state,
                toastr : toaster,
                UserCreditCards : mockCreditCard,
                MyPaymentCreditCardModal : creditCardModal,
                ocConfirm : ocConfirm,
                $exceptionHandler: exceptionHandler,
                UserSpendingAccounts : mockSpendingAccount,
                GiftCards : mockGiftCard,
                ocAuthNet: authNet
            });
            spyOn(state, 'reload');
            spyOn(toaster, 'success');
        }));
        describe('Create Credit Card', function(){
            beforeEach(function(){
                var df = q.defer();
                df.resolve();
                spyOn(creditCardModal, 'Create').and.returnValue(df.promise);
                // spyOn(oc.Payments, 'List').and.returnValue(df.promise);
                myPaymentCtrl.createCreditCard();
            });
            it('should call the create credit card modal then reload the state and display success toastr', function(){
                expect(creditCardModal.Create).toHaveBeenCalled();
                scope.$digest();
                expect(toaster.success).toHaveBeenCalledWith('Credit Card Created', 'Success');
                expect(state.reload).toHaveBeenCalledWith('myPayments');
            });
        });
        describe('Edit a Credit Card', function(){
            beforeEach(function(){
                var df = q.defer();
                df.resolve();
                spyOn(creditCardModal, 'Edit').and.returnValue(df.promise);
                myPaymentCtrl.edit(mockCreditCard);
            });
            it('should call the edit credit card modal then reload the state and display success toaster', function(){
                expect(creditCardModal.Edit).toHaveBeenCalledWith(mockCreditCard);
                scope.$digest();
                expect(toaster.success).toHaveBeenCalledWith('Credit Card Updated', 'Success');
                expect(state.reload).toHaveBeenCalledWith('myPayments');
            })
        });
        describe('Delete a Credit Card', function(){
            beforeEach(function(){
                var df = q.defer();
                df.resolve();
                spyOn(confirm, 'Confirm').and.returnValue(df.promise);
                spyOn(authNet, 'DeleteCreditCard').and.returnValue(df.promise);
                myPaymentCtrl.delete(mockCreditCard);
            });
            it('should call the delete credit card function, then  call Authorize.Net service , then reload the state and display success toaster', function(){
                expect(confirm.Confirm).toHaveBeenCalledWith("Are you sure you want to delete this Credit Card?");
                scope.$digest();

                expect(authNet.DeleteCreditCard).toHaveBeenCalled();
                scope.$digest();
                expect(toaster.success).toHaveBeenCalledWith('Credit Card Deleted', 'Success');
                expect(state.reload).toHaveBeenCalledWith('myPayments');
            })
        })


    });

});

