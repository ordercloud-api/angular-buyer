describe('Component: myPayments', function() {
    var scope,
        q,
        oc,
        uibModalInstance
        ;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope, $q, OrderCloud) {
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloud;

    }));
    describe('Factory: MyPaymentCreditCardModal', function() {
        var uibModal,
            creditCardModal,
            createModalOptions,
            editModalOptions,
            actualOptions;
        beforeEach(inject(function($uibModal, MyPaymentCreditCardModal) {
            uibModal = $uibModal;
            creditCardModal = MyPaymentCreditCardModal;
            uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);
            createModalOptions = {
                templateUrl: 'myPayments/templates/myPaymentsCreditCard.create.modal.tpl.html',
                controller: 'CreateCreditCardModalCtrl',
                controllerAs: 'createCreditCard',
                size: 'md'
            };
            editModalOptions = {
                templateUrl: 'myPayments/templates/myPaymentsCreditCard.edit.modal.tpl.html',
                controller: 'EditCreditCardModalCtrl',
                controllerAs: 'editCreditCard',
                size: 'md',
                resolve: {
                    //we dont care what gets returned here because functions can't be 
                    //compared anyway. We do however mock a function that captures the  options
                    //passed in and verify they are the same, in the test.
                    SelectedCreditCard: jasmine.any(Function)
                }
            };
        }));
        describe('Create', function() {
            it('should call $uibModal open with create modal template/controller', function() {
                spyOn(uibModal, 'open').and.returnValue(uibModalInstance);
                creditCardModal.Create();
                expect(uibModal.open).toHaveBeenCalledWith(createModalOptions);
            });
        });
        describe('Edit', function() {
            it('should call $uibModal with edit modal template/controller', function() {
                spyOn(uibModal, 'open').and.callFake(function(options) {
                    actualOptions = options;
                    return uibModalInstance;
                });
                creditCardModal.Edit('addressToEdit');
                expect(uibModal.open).toHaveBeenCalledWith(editModalOptions);
                expect(actualOptions.resolve.SelectedCreditCard()).toEqual('addressToEdit');
            });
        });
    });
    describe('Controller: CreateCreditCardModalController', function(){
        var CreateCreditCardModalCtrl,
            ccUtility,
            authNet,
            data
            ;
        beforeEach(inject(function($controller, $exceptionHandler, AuthorizeNet){
            authNet = AuthorizeNet;
            data = { ResponseBody : {}};
            CreateCreditCardModalCtrl = $controller('CreateCreditCardModalCtrl', {
                $q : q,
                $exceptionHandler: $exceptionHandler,
                $uibModalInstance: uibModalInstance,
                creditCardUtility: ccUtility,
                AuthorizeNet : authNet
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
            it('should call AuthorizeNet Create Credit Card then close modal', function(){
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
            ccUtility
            ;

        beforeEach(inject(function($controller, $exceptionHandler,creditCardUtility, AuthorizeNet ){
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
            ccUtility = creditCardUtility;
            authNet = AuthorizeNet;
            exceptionHandler = $exceptionHandler;

            EditCreditCardModalCtrl = $controller('EditCreditCardModalCtrl', {
                $q: q,
                $exceptionHandler: exceptionHandler,
                $uibModalInstance: uibModalInstance,
                AuthorizeNet: authNet,
                creditCardUtility: ccUtility,
                SelectedCreditCard: mockCCResolve
            });
            var defer = q.defer();
            defer.resolve({});
            spyOn(authNet, 'UpdateCreditCard').and.returnValue(defer.promise);
        }));
        describe('cancel', function(){
            it('should dismiss the modal', function(){
                EditCreditCardModalCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
        describe('submit', function(){
            it('should call AuthorizeNet Update Credit Card', function(){
                EditCreditCardModalCtrl.submit();
                expect(authNet.UpdateCreditCard).toHaveBeenCalledWith(mockCCResolve);
                scope.$digest();
                expect(uibModalInstance.close).toHaveBeenCalledWith({});
            });
        });

    });


});