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
            confirm,
            addressModal,
            mockAddress,
            mockAddressList
        ;
        beforeEach(inject(function($state, toastr, ocConfirm, MyAddressesModal, $controller){
            state = $state;
            toaster = toastr;
            confirm = ocConfirm;
            addressModal = MyAddressesModal;
            mockAddress = {ID:"MOCK_ADDRESS_ID"};
            mockAddressList = {Items:[mockAddress]};
            myAddressesCtrl = $controller('MyAddressesCtrl', {
                $scope: scope,
                $state: state,
                toastr: toaster,
                AddressList: mockAddressList
            });
            spyOn(state, 'reload');
            spyOn(toaster, 'success');
        }));
        it ('Should initialize the view model with the address list', function() {
            expect(myAddressesCtrl.list).toEqual(mockAddressList);
        });
        describe('create', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve("NEW_ADDRESS");
                spyOn(addressModal, 'Create').and.returnValue(defer.promise);
                myAddressesCtrl.create();
            });
            it('should call the create address modal then reload the state and display success toastr', function(){
                expect(addressModal.Create).toHaveBeenCalled();
                scope.$digest();
                expect(toaster.success).toHaveBeenCalledWith('Address Created', 'Success');
                expect(myAddressesCtrl.list).toEqual({Items:[mockAddress, "NEW_ADDRESS"]});

            });
        });
        describe('edit', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve("EDITED_ADDRESS");
                spyOn(addressModal, 'Edit').and.returnValue(defer.promise);
                myAddressesCtrl.edit({$index:0, address:mockAddress});
            });
            it('should call the edit address modal, then reload the state and display success toastr', function(){
                expect(addressModal.Edit).toHaveBeenCalledWith(mockAddress);
                scope.$digest();
                expect(toaster.success).toHaveBeenCalledWith('Address Saved', 'Success');
                expect(myAddressesCtrl.list).toEqual({Items:["EDITED_ADDRESS"]});
            });
        });
        describe('delete', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(confirm, 'Confirm').and.returnValue(defer.promise);
                spyOn(oc.Me, 'DeleteAddress').and.returnValue(defer.promise);
                myAddressesCtrl.delete({$index:0, address:mockAddress});
            });
            it('should delete address, after prompting user to confirm', function(){
                expect(confirm.Confirm).toHaveBeenCalled();
                scope.$digest();
                expect(oc.Me.DeleteAddress).toHaveBeenCalledWith('MOCK_ADDRESS_ID');
                expect(toaster.success).toHaveBeenCalledWith('Address Deleted', 'Success');
                expect(myAddressesCtrl.list).toEqual({Items:[]});
            });
        });
    });
});