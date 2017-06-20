describe('Service: ocPayment', function() {
    var ocPaymentService;
    beforeEach(inject(function(ocPayment) {
        ocPaymentService = ocPayment;
    }));
    
    describe('Method: Init(order, paymentType)', function() {
        var createSpyOn;
        beforeEach(function() {
            createSpyOn = function(result) {
                var df = q.defer();
                df.resolve(result);
                return spyOn(oc.Payments, 'List').and.returnValue(df.promise);
            }
        })
        it ('should list existing payments on the passed in order', function() {
            createSpyOn();

            ocPaymentService.Init(mock.Order);
            expect(oc.Payments.List).toHaveBeenCalledWith('outgoing', mock.Order.ID)
        })
        describe('when payment exceeds total', function() {
            beforeEach(function() {
                createSpyOn({Items: [mock.Payment]});
                spyOn(ocPaymentService, 'PaymentsExceedTotal').and.returnValue(true);
                spyOn(ocPaymentService, 'RemoveAllPayments').and.returnValue(dummyPromise);
                spyOn(ocPaymentService, 'AddPayment').and.returnValue(dummyPromise);
                ocPaymentService.Init(mock.Order, 'PurchaseOrder');
                scope.$digest();
            })
            it ('should check if the existing payments exceed the order total', function() {
                expect(ocPaymentService.PaymentsExceedTotal).toHaveBeenCalledWith([mock.Payment], mock.Order.Total);
            })
            it ('should call remove all payments', function() {
                expect(ocPaymentService.RemoveAllPayments).toHaveBeenCalledWith({Items: [mock.Payment]}, mock.Order);
            })
            it ('should add a new purchase order payment', function() {
                scope.$digest();
                expect(ocPaymentService.AddPayment).toHaveBeenCalledWith(mock.Order, 'PurchaseOrder');
            })
        })
        describe('when payments do not exceed order total', function() {
            var altMockPayment = {ID: mock.Payment.ID, Amount: 100}
            beforeEach(function() {
                createSpyOn({Items: [altMockPayment]});
                spyOn(ocPaymentService, 'PaymentsExceedTotal').and.returnValue(false);
                spyOn(ocPaymentService, 'CalculateMaxTotal').and.returnValue(false);
                spyOn(ocPaymentService, 'AddPayment').and.returnValue(dummyPromise);
                spyOn(oc.Me, 'GetCreditCard').and.returnValue(dummyPromise);
                spyOn(oc.Me, 'GetSpendingAccount').and.returnValue(dummyPromise);
                ocPaymentService.Init(mock.Order, 'PurchaseOrder');
                scope.$digest();
            })
            it ('should check if the existing payments exceed the order total', function() {
                expect(ocPaymentService.PaymentsExceedTotal).toHaveBeenCalledWith([altMockPayment], mock.Order.Total);
            })
            it ('should check if a single line item is not greater than the max total', function() {
                expect(ocPaymentService.CalculateMaxTotal).toHaveBeenCalledWith(mock.Order, [altMockPayment]);
            })
            it ('should add a new purchase order payment', function() {
                expect(ocPaymentService.AddPayment).not.toHaveBeenCalled();
                expect(oc.Me.GetCreditCard).not.toHaveBeenCalled();
                expect(oc.Me.GetSpendingAccount).not.toHaveBeenCalled();
            })
        })
        describe('when there are no payments on the order', function() {
            beforeEach(function() {
                createSpyOn({Items: []});
                spyOn(ocPaymentService, 'PaymentsExceedTotal').and.returnValue(false);
                spyOn(ocPaymentService, 'RemoveAllPayments').and.returnValue(dummyPromise);
                spyOn(ocPaymentService, 'AddPayment').and.returnValue(dummyPromise);
                ocPaymentService.Init(mock.Order, 'PurchaseOrder');
                scope.$digest();
            })
            it ('should check if the existing payments exceed the order total', function() {
                expect(ocPaymentService.PaymentsExceedTotal).toHaveBeenCalledWith([], mock.Order.Total);
            })
            it ('should add a new purchase order payment', function() {
                expect(ocPaymentService.RemoveAllPayments).not.toHaveBeenCalled();
                expect(ocPaymentService.AddPayment).toHaveBeenCalledWith(mock.Order, 'PurchaseOrder');
            })
        })
    })

    describe('Method: AddPayment(order, paymentType, currentPayments)', function() {
        var mockAltPayment = {ID:mock.Payment.ID, Amount: 50};
        beforeEach(function() {
            var df = q.defer();
            df.resolve(mockAltPayment);
            spyOn(oc.Payments, 'Create').and.returnValue(df.promise);
        })
        describe('when purchase order payment', function() {
            it ('when no current payments it should create a new purchase order payment with the order total as the amount', function() {
                ocPaymentService.AddPayment(mock.Order, 'PurchaseOrder');
                expect(oc.Payments.Create).toHaveBeenCalledWith('outgoing', mock.Order.ID, {
                    Type: 'PurchaseOrder',
                    DateCreated: jasmine.any(String),
                    Amount: mock.Order.Total
                })
            })
            it ('when current payments exist it should create a new purchase order payment with remaining order total as the amount', function() {
                ocPaymentService.AddPayment(mock.Order, 'PurchaseOrder', [mockAltPayment]);
                expect(oc.Payments.Create).toHaveBeenCalledWith('outgoing', mock.Order.ID, {
                    Type: 'PurchaseOrder',
                    DateCreated: jasmine.any(String),
                    Amount: 50
                })
            })
        })
        describe('when not a purchase order payment', function() {
            it ('should not call OrderCloudSDK.Payments.Create()', function() {
                ocPaymentService.AddPayment(mock.Order, 'CreditCard');
                expect(oc.Payments.Create).not.toHaveBeenCalled();
            })
        })
    })

    describe('Method: CalculateMaxTotal(order, payments)', function() {
        var mockPaymentsA = [{Amount:25}, {Amount:25}];
        var mockPaymentsB = [{Amount:50}, {Amount:50}];
        it ('should add the remaining order total to each payment as payment.MaxAmount', function() {
            ocPaymentService.CalculateMaxTotal(mock.Order, mockPaymentsA);
            expect(mockPaymentsA[0].MaxAmount).toEqual('75.00');
            expect(mockPaymentsA[1].MaxAmount).toEqual('75.00');
        })
        it ('should return true if there is still a remaining unpaid amount', function() {
            expect(ocPaymentService.CalculateMaxTotal(mock.Order, mockPaymentsA)).toBe(true)
        })
        it ('should return false if the payment amounts add up to the order total', function() {
            expect(ocPaymentService.CalculateMaxTotal(mock.Order, mockPaymentsB)).toBe(false);
        })
    })

    describe('Method: PaymentsExceedTotal(payments, orderTotal)', function() {
        var mockPaymentsA = [{Amount:50}, {Amount:50}];
        var mockPaymentsB = [{Amount:100}, {Amount:100}];
        it ('should return false if the payments add up to be equal to or less than the order total', function() {
            expect(ocPaymentService.PaymentsExceedTotal({Items:mockPaymentsA}, mock.Order.Total)).toBe(false);
        })
        it ('should return true if the payments add up to more than the order total', function() {
            expect(ocPaymentService.PaymentsExceedTotal({Items:mockPaymentsB}, mock.Order.Total)).toBe(true);
        })
    })

    describe('Method: RemoveAllPayments(payments, order)', function() {
        var mockPayments = {Items: [mock.Payment, mock.Payment]};
        it ('should delete all of the payments on the order', function() {
            spyOn(oc.Payments, 'Delete').and.returnValue(dummyPromise);
            ocPaymentService.RemoveAllPayments(mockPayments, mock.Order);
            expect(oc.Payments.Delete).toHaveBeenCalledWith('outgoing', mock.Order.ID, mock.Payment.ID);
            expect(oc.Payments.Delete).toHaveBeenCalledTimes(2);
        })
    })

    describe('Method: SelectPaymentAccount(payment, order)', function() {
        var selectPaymentAccountModalOptions = {
            templateUrl: 'common/directives/oc-payment/selectPaymentAccount.modal.html',
            controller: 'SelectPaymentAccountModalCtrl',
            controllerAs: 'selectPaymentAccount',
            size: 'md',
            resolve: jasmine.any(Object)
        }
        beforeEach(function() {
            spyOn(uibModalService, 'open').and.callThrough();
            spyOn(oc.Me, 'ListSpendingAccounts').and.returnValue(dummyPromise);
            spyOn(oc.Me, 'ListCreditCards').and.returnValue(dummyPromise);
        })
        it ('should open the select payment account modal', function() {
            ocPaymentService.SelectPaymentAccount({}, mock.Order);
            expect(uibModalService.open).toHaveBeenCalledWith(selectPaymentAccountModalOptions);
        })
        it ('should list spending accounts when payment.Type is "SpendingAccount"', function() {
            ocPaymentService.SelectPaymentAccount({Type: 'SpendingAccount'}, mock.Order);
            expect(oc.Me.ListSpendingAccounts).toHaveBeenCalledWith({
                page:1,
                pageSize:100,
                filters: {
                    RedemptionCode: '!*',
                    AllowAsPaymentMethod: true
                }
            });
            expect(oc.Me.ListCreditCards).not.toHaveBeenCalled();
        })
        it ('should list credit cards when payment.Type is "CreditCard"', function() {
            ocPaymentService.SelectPaymentAccount({Type: 'CreditCard'}, mock.Order);
            expect(oc.Me.ListSpendingAccounts).not.toHaveBeenCalled();
            expect(oc.Me.ListCreditCards).toHaveBeenCalledWith({
                page:1,
                pageSize:100
            });
        })
    })

    describe('Method: Save', function() {
        var mockAccount = 'MOCK_ACCOUNT',
            createSpyOn;
        beforeEach(function() {
            spyOn(oc.Payments, 'Delete').and.returnValue(dummyPromise);
            spyOn(rootScope, '$broadcast').and.callThrough();
        })
        describe('when the payment already has an ID', function() {
            beforeEach(function() {
                var df = q.defer();
                df.resolve(mock.Payment);
                spyOn(oc.Payments, 'Create').and.returnValue(df.promise);
                ocPaymentService.Save({ID:mock.Payment.ID, Type: 'PurchaseOrder'}, mock.Order, mockAccount);
            })
            it ('should delete the old payment ID', function() {
                expect(oc.Payments.Delete).toHaveBeenCalledWith('outgoing', mock.Order.ID, mock.Payment.ID);
            })
            it ('should create a new payment', function() {
                scope.$digest();
                expect(oc.Payments.Create).toHaveBeenCalled();
            })
            it ('should broadcast the "OCPaymentUpdated" event with the new payment', function() {
                scope.$digest();
                expect(rootScope.$broadcast).toHaveBeenCalledWith('OCPaymentUpdated', mock.Payment);
            })
        })
        describe('when the payment does not have an ID', function() {
            beforeEach(function() {
                var df = q.defer();
                df.resolve(mock.Payment);
                spyOn(oc.Payments, 'Create').and.returnValue(df.promise);
                ocPaymentService.Save({Type: 'PurchaseOrder'}, mock.Order, mockAccount);
            })
            it ('should not attempt to delete an old payment', function() {
                expect(oc.Payments.Delete).not.toHaveBeenCalled();
            })
            it ('should create a new payment', function() {
                expect(oc.Payments.Create).toHaveBeenCalled();
            })
            it ('should broadcast the "OCPaymentUpdated" event with the new payment', function() {
                scope.$digest();
                expect(rootScope.$broadcast).toHaveBeenCalledWith('OCPaymentUpdated', mock.Payment);
            })
        })
        describe('when creating a credit card payment', function() {
            var mockCCPayment = {CreditCardID: mock.CreditCard.ID};
            beforeEach(function() {
                var df = q.defer();
                df.resolve(mockCCPayment);
                spyOn(oc.Payments, 'Create').and.returnValue(df.promise);
                ocPaymentService.Save({Type: 'CreditCard'}, mock.Order, mockAccount);
            })
            it ('should attach the account to payment.CreditCard and broadcast the event', function() {
                scope.$digest();
                mockCCPayment.CreditCard = mockAccount;
                expect(rootScope.$broadcast).toHaveBeenCalledWith('OCPaymentUpdated', mockCCPayment);
            })
        })
        describe('when creating a spending account payment', function() {
            var mockSAPayment = {CreditCardID: mock.SpendingAcct.ID};
            beforeEach(function() {
                var df = q.defer();
                df.resolve(mockSAPayment);
                spyOn(oc.Payments, 'Create').and.returnValue(df.promise);
                ocPaymentService.Save({Type: 'SpendingAccount'}, mock.Order, mockAccount);
            })
            it ('should attach the account to payment.SpendingAccount and broadcast the event', function() {
                scope.$digest();
                mockSAPayment.SpendingAccount = mockAccount;
                expect(rootScope.$broadcast).toHaveBeenCalledWith('OCPaymentUpdated', mockSAPayment);
            })
        })
    })
})