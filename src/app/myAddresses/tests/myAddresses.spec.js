describe('Component: myAddresses', function(){
    var scope,
        q,
        oc,
        state
        ;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope, $q, OrderCloud, $state){
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloud;
        state = $state;
    }));

    describe('State: myAddresses', function(){
        beforeEach(inject(function($state){
            state = $state.get('myAddresses');
            spyOn(oc.Me, 'ListAddresses');
        }));
        it('should resolve AddressList', inject(function($injector){
            $injector.invoke(state.resolve.AddressList);
            expect(oc.Me.ListAddresses).toHaveBeenCalledWith(null, null, null, null, null, {Editable:true});
        }));
    });

    describe('Controller: MyAddressesCtrl', function(){
        var myAddressesCtrl,
            state,
            toaster,
            ocConfirm,
            addressModal,
            mockAddressList
        ;
        beforeEach(inject(function($state, toastr, OrderCloudConfirm, MyAddressesModal, $controller){
            state = $state;
            toaster = toastr;
            ocConfirm = OrderCloudConfirm;
            addressModal = MyAddressesModal;
            mockAddressList = 'address1';
            myAddressesCtrl = $controller('MyAddressesCtrl', {
                $scope: scope,
                $state: state,
                toastr: toaster,
                AddressList: mockAddressList
            });
            spyOn(state, 'reload');
            spyOn(toaster, 'success');
        }));
        describe('create', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(addressModal, 'Create').and.returnValue(defer.promise);
                myAddressesCtrl.create();
            });
            it('should call the create address modal then reload the state and display success toastr', function(){
                expect(addressModal.Create).toHaveBeenCalled();
                scope.$digest();
                expect(toaster.success).toHaveBeenCalledWith('Address Created', 'Success');
                expect(state.reload).toHaveBeenCalledWith('myAddresses');
            });
        });
        describe('edit', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(addressModal, 'Edit').and.returnValue(defer.promise);
                myAddressesCtrl.edit();
            });
            it('should call the edit address modal, then reload the state and display success toastr', function(){
                expect(addressModal.Edit).toHaveBeenCalled();
                scope.$digest();
                expect(toaster.success).toHaveBeenCalledWith('Address Saved', 'Success');
                expect(state.reload).toHaveBeenCalledWith('myAddresses');
            });
        });
        describe('delete', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(ocConfirm, 'Confirm').and.returnValue(defer.promise);
                spyOn(oc.Me, 'DeleteAddress').and.returnValue(defer.promise);
                myAddressesCtrl.delete({'address':{ID: 'ID123'}});
            });
            it('should delete address, after prompting user to confirm', function(){
                expect(ocConfirm.Confirm).toHaveBeenCalledWith('Are you sure you want to delete this address?');
                scope.$digest();
                expect(oc.Me.DeleteAddress).toHaveBeenCalledWith('ID123');
                expect(toaster.success).toHaveBeenCalledWith('Address Deleted', 'Success');
                expect(state.reload).toHaveBeenCalledWith('myAddresses');
            });
        });
    });
});