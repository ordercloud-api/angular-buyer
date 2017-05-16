describe('Component: myAddresses', function() {
    var _ocMyAddresses,
        uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);

    beforeEach(inject(function(ocMyAddresses){
        _ocMyAddresses = ocMyAddresses;
    })); 
    describe('Factory: MyAddressesModal', function() {
        var uibModal,
            addressModal,
            createModalOptions,
            editModalOptions,
            actualOptions;
        beforeEach(inject(function($uibModal) {
            uibModal = $uibModal;
            uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);
            createModalOptions = {
                templateUrl: 'myAddresses/templates/myAddresses.create.modal.html',
                controller: 'CreateAddressModalCtrl',
                controllerAs: 'createAddress',
                size: 'md'
            };
            editModalOptions = {
                templateUrl: 'myAddresses/templates/myAddresses.edit.modal.html',
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
                _ocMyAddresses.Create();
                expect(uibModal.open).toHaveBeenCalledWith(createModalOptions);
            });
        });
        describe('Edit', function() {
            it('should call $uibModal with edit modal template/controller', function() {
                spyOn(uibModal, 'open').and.callFake(function(options) {
                    actualOptions = options;
                    return uibModalInstance;
                });
                _ocMyAddresses.Edit('addressToEdit');
                expect(uibModal.open).toHaveBeenCalledWith(editModalOptions);
                expect(actualOptions.resolve.SelectedAddress()).toEqual('addressToEdit');
            });
        });
    });
    describe('Controller: CreateAddressModalController', function(){
        var createAddressModalCtrl;
        beforeEach(inject(function($controller, $exceptionHandler, ocGeography){
            createAddressModalCtrl = $controller('CreateAddressModalCtrl', {
                $exceptionHandler: $exceptionHandler,
                $uibModalInstance: uibModalInstance,
                ocGeography: ocGeography
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
            mockAddressResolve;
        beforeEach(inject(function($controller, $exceptionHandler, ocGeography){
            mockAddressResolve = {name:'mockAddress', ID:'1'}
            editAddressModalCtrl = $controller('EditAddressModalCtrl', {
                $exceptionHandler: $exceptionHandler,
                $uibModalInstance: uibModalInstance,
                ocGeography: ocGeography,
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