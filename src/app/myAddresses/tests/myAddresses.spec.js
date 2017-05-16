describe('Component: myAddresses', function(){
    var _ocMyAddresses;
    var address;
    beforeEach(inject(function(ocMyAddresses){
        _ocMyAddresses = ocMyAddresses;
    }));

    describe('State: myAddresses', function(){
        var myAddressesState;
        beforeEach(function(){
            myAddressesState = state.get('myAddresses');
            spyOn(oc.Me, 'ListAddresses');
        });
        it('should resolve AddressList', function(){
            mock.Parameters = {
                filters: {
                    Editable: true
                }
            }
            injector.invoke(myAddressesState.resolve.AddressList);
            expect(oc.Me.ListAddresses).toHaveBeenCalledWith(mock.Parameters);
        });
    });

    describe('Controller: MyAddressesCtrl', function(){
        var myAddressesCtrl;
        beforeEach(inject(function($controller){
            mockAddress = {ID:"MOCK_ADDRESS_ID"};
            mockAddressList = {Items:[mockAddress]};
            myAddressesCtrl = $controller('MyAddressesCtrl', {
                $scope: scope,
                AddressList: mockAddressList
            });
            spyOn(state, 'reload');
            spyOn(toastrService, 'success');
        }));
        it ('Should initialize the view model with the address list', function() {
            expect(myAddressesCtrl.list).toEqual(mockAddressList);
        });
        describe('create', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve("NEW_ADDRESS");
                spyOn(_ocMyAddresses, 'Create').and.returnValue(defer.promise);
                myAddressesCtrl.create();
            });
            it('should call the create address modal then reload the state and display success toastr', function(){
                expect(_ocMyAddresses.Create).toHaveBeenCalled();
                scope.$digest();
                expect(toastrService.success).toHaveBeenCalledWith(address + ' was created');
                expect(myAddressesCtrl.list).toEqual({Items:[mockAddress, "NEW_ADDRESS"]});

            });
        });
        describe('edit', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve("EDITED_ADDRESS");
                spyOn(_ocMyAddresses, 'Edit').and.returnValue(defer.promise);
                myAddressesCtrl.edit({$index:0, address:mockAddress});
            });
            it('should call the edit address modal, then reload the state and display success toastr', function(){
                expect(_ocMyAddresses.Edit).toHaveBeenCalledWith(mockAddress);
                scope.$digest();
                expect(toastrService.success).toHaveBeenCalledWith(address + ' was saved');
                expect(myAddressesCtrl.list).toEqual({Items:["EDITED_ADDRESS"]});
            });
        });
        describe('delete', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(ocConfirmService, 'Confirm').and.returnValue(defer.promise);
                spyOn(oc.Me, 'DeleteAddress').and.returnValue(defer.promise);
                myAddressesCtrl.delete({$index:0, address:mockAddress});
            });
            it('should delete address, after prompting user to confirm', function(){
                expect(ocConfirmService.Confirm).toHaveBeenCalled();
                scope.$digest();
                expect(oc.Me.DeleteAddress).toHaveBeenCalledWith('MOCK_ADDRESS_ID');
                expect(toastrService.success).toHaveBeenCalledWith(address + ' was deleted');
                expect(myAddressesCtrl.list).toEqual({Items:[]});
            });
        });
    });
});