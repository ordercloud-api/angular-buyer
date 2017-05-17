describe('Component: myPayments', function() {
    var uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);
    describe('Factory: MyPaymentCreditCardModal', function() {
        var uibModal,
            myPaymentCCModal,
            createModalOptions,
            editModalOptions,
            actualOptions;
        beforeEach(inject(function($uibModal, ocMyCreditCards) {
            uibModal = $uibModal;
            myPaymentCCModal = ocMyCreditCards;
            createModalOptions = {
                templateUrl: 'myPayments/templates/myPaymentsCreditCard.create.modal.html',
                controller: 'CreateCreditCardModalCtrl',
                controllerAs: 'createCreditCard',
                size: 'md'
            };
            editModalOptions = {
                templateUrl: 'myPayments/templates/myPaymentsCreditCard.edit.modal.html',
                controller: 'EditCreditCardModalCtrl',
                controllerAs: 'editCreditCard',
                size: 'md',
                resolve: {
                    SelectedCreditCard: jasmine.any(Function)
                }
            };
        }));
        describe('Create', function() {
            it('should call $uibModal open with create modal template/controller', function() {
                spyOn(uibModal, 'open').and.returnValue(uibModalInstance);
                myPaymentCCModal.Create();
                expect(uibModal.open).toHaveBeenCalledWith(createModalOptions);
            });
        });
        describe('Edit', function() {
            it('should call $uibModal with edit modal template/controller', function() {
                spyOn(uibModal, 'open').and.callFake(function(options) {
                    actualOptions = options;
                    return uibModalInstance;
                });
                myPaymentCCModal.Edit('addressToEdit');
                expect(uibModal.open).toHaveBeenCalledWith(editModalOptions);
                expect(actualOptions.resolve.SelectedCreditCard()).toEqual('addressToEdit');
            });
        });
    });
    describe('Controller: CreateCreditCardModalController', function(){
        var CreateCreditCardModalCtrl,
            authNet,
            data
            ;
        beforeEach(inject(function($controller, ocAuthNet, ocCreditCardUtility){
            authNet = ocAuthNet;
            data = { ResponseBody : {}};
            CreateCreditCardModalCtrl = $controller('CreateCreditCardModalCtrl', {
                $uibModalInstance: uibModalInstance,
                ocCreditCardUtility: ocCreditCardUtility,
                ocAuthNet : authNet
            });
            var defer = q.defer();
            defer.resolve(data);
            spyOn(authNet, 'CreateCreditCard').and.returnValue(defer.promise);
        }));
        describe('cancel', function(){
            it('should dismiss the modal', function(){
                CreateCreditCardModalCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
        describe('submit', function(){
            it('should call ocAuthNet Create Credit Card then close modal', function(){
                CreateCreditCardModalCtrl.submit();
                expect(authNet.CreateCreditCard).toHaveBeenCalledWith({});
                scope.$digest();
                expect(uibModalInstance.close).toHaveBeenCalledWith(data.ResponseBody);
            });
        });
    });

    describe('Controller: EditCreditCardModalController', function(){
        var EditCreditCardModalCtrl,
            authNet,
            mockCCResolve,
            ccUtility,
            data
            ;

        beforeEach(inject(function($controller, ocCreditCardUtility, ocAuthNet ){
            data = { ResponseBody : {}};
            mockCCResolve = {
                CardType: "Visa",
                CardholderName: "Test Card",
                DateCreated: "2016-12-09T23:13:17.773+00:00",
                Editable: true,
                ExpirationDate: "2018-04-01T00:00:00+00:00",
                ExpirationMonth: "04",
                ExpirationYear: 2018,
                ID: "ocV_h0lRuk27xC5CuZ5FEA",
                PartialAccountNumber: "4555",
                Token: "1802947170"
            };
            ccUtility = ocCreditCardUtility;
            authNet = ocAuthNet;

            EditCreditCardModalCtrl = $controller('EditCreditCardModalCtrl', {
                $q: q,
                $uibModalInstance: uibModalInstance,
                ocAuthNet: authNet,
                ocCreditCardUtility: ccUtility,
                SelectedCreditCard: mockCCResolve
            });
            var defer = q.defer();
            defer.resolve(data);
            spyOn(authNet, 'UpdateCreditCard').and.returnValue(defer.promise);
        }));
        describe('cancel', function(){
            it('should dismiss the modal', function(){
                EditCreditCardModalCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
        describe('submit', function(){
            it('should call ocAuthNet Update Credit Card', function(){
                EditCreditCardModalCtrl.submit();
                expect(authNet.UpdateCreditCard).toHaveBeenCalledWith(mockCCResolve);
                scope.$digest();
                expect(uibModalInstance.close).toHaveBeenCalledWith(data.ResponseBody);
            });
        });

    });


});