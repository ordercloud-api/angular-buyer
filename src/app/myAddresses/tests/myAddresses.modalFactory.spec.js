describe('Component: myAddresses', function() {
    var scope,
        q,
        oc,
        uibModalInstance
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope, $q, OrderCloud) {
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloud;
    }));
    describe('Factory: MyAddressesModal', function() {
        var uibModal,
            addressModal,
            createModalOptions,
            editModalOptions,
            actualOptions;
        beforeEach(inject(function($uibModal, MyAddressesModal) {
            uibModal = $uibModal;
            addressModal = MyAddressesModal;
            uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);
            createModalOptions = {
                templateUrl: 'myAddresses/templates/myAddresses.create.modal.tpl.html',
                controller: 'CreateAddressModalCtrl',
                controllerAs: 'createAddress',
                size: 'md'
            };
            editModalOptions = {
                templateUrl: 'myAddresses/templates/myAddresses.edit.modal.tpl.html',
                controller: 'EditAddressModalCtrl',
                controllerAs: 'editAddress',
                size: 'md',
                resolve: {
                    //we dont care what gets returned here because functions can't be 
                    //compared anyway. We do however mock a function that captures the  options
                    //passed in and verify they are the same, in the test.
                    SelectedAddress: jasmine.any(Function)
                }
            };
        }));
        describe('Create', function() {
            it('should call $uibModal open with create modal template/controller', function() {
                spyOn(uibModal, 'open').and.returnValue(uibModalInstance);
                addressModal.Create();
                expect(uibModal.open).toHaveBeenCalledWith(createModalOptions);
            });
        });
        describe('Edit', function() {
            it('should call $uibModal with edit modal template/controller', function() {
                spyOn(uibModal, 'open').and.callFake(function(options) {
                    actualOptions = options;
                    return uibModalInstance;
                });
                addressModal.Edit('addressToEdit');
                expect(uibModal.open).toHaveBeenCalledWith(editModalOptions);
                expect(actualOptions.resolve.SelectedAddress()).toEqual('addressToEdit');
            });
        });
    });
    describe('Controller: CreateAddressModalController', function(){
        var createAddressModalCtrl
        ;
        beforeEach(inject(function($controller, $exceptionHandler, OCGeography){
            createAddressModalCtrl = $controller('CreateAddressModalCtrl', {
                $exceptionHandler: $exceptionHandler,
                $uibModalInstance: uibModalInstance,
                OCGeography: OCGeography
            });
            var defer = q.defer();
            defer.resolve('newAddress');
            spyOn(oc.Me, 'CreateAddress').and.returnValue(defer.promise);
        }));
        describe('cancel', function(){
            it('should dismiss the modal', function(){
                createAddressModalCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
        describe('submit', function(){
           it('should call OrderCloud.Me Create Address', function(){
               createAddressModalCtrl.submit();
               expect(oc.Me.CreateAddress).toHaveBeenCalledWith({Country:'US', Shipping: true, Billing: true});
               scope.$digest();
               expect(uibModalInstance.close).toHaveBeenCalledWith('newAddress');
           });
        });
    });
    describe('Controller: EditAddressModalCtrl', function(){
        var editAddressModalCtrl,
        mockAddressResolve
        ;
        beforeEach(inject(function($controller, $exceptionHandler, OCGeography){
            mockAddressResolve = {name:'mockAddress', ID:'1'}
            editAddressModalCtrl = $controller('EditAddressModalCtrl', {
                $exceptionHandler: $exceptionHandler,
                $uibModalInstance: uibModalInstance,
                OCGeography: OCGeography,
                SelectedAddress: mockAddressResolve
            });
            var defer = q.defer();
            defer.resolve('newAddress');
            spyOn(oc.Me, 'UpdateAddress').and.returnValue(defer.promise);
        }));
        describe('cancel', function(){
            it('should dismiss the modal', function(){
                editAddressModalCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
        describe('submit', function(){
           it('should call OrderCloud.Me Update Address', function(){
               editAddressModalCtrl.submit();
               expect(oc.Me.UpdateAddress).toHaveBeenCalledWith('1', {name:'mockAddress', ID:'1', Shipping: true, Billing: true});
               scope.$digest();
               expect(uibModalInstance.close).toHaveBeenCalledWith('newAddress');
           });
        });
    });
});