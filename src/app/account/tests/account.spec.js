describe('Component: Account', function() {
    var scope,
        q,
        account,
        accountFactory;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope, AccountService) {
        q = $q;
        scope = $rootScope.$new();
        account = {
            ID: "TestAccount123456789",
            Username: "TestAccount",
            Password: "Fails345",
            FirstName: "Test",
            LastName: "Test",
            Email: "test@test.com",
            TermsAccepted: true,
            Active: true
        };
        accountFactory = AccountService;
    }));

    describe('Factory: AccountService', function() {
        var oc;
        beforeEach(inject(function(OrderCloud) {
            oc = OrderCloud;
            var defer = q.defer();
            defer.resolve();
            spyOn(oc.Auth, 'GetToken').and.returnValue(defer.promise);
            spyOn(oc.Me, 'Update').and.returnValue(defer.promise);
        }));

        describe('Update', function() {
            var uibModal,
                currentProfile = {
                    ID: 'FAKEID',
                    Username: 'FAKEUSERNAME'
                },
                newProfile = {
                    Username: 'FAKENEWPROFILE'
                };
            beforeEach(inject(function($uibModal) {
                uibModal = $uibModal;
            }));
            it ('should open a uibModal, confirm their password, and update the user', function() {
                var defer = q.defer();
                defer.resolve('FAKEPASSWORD');
                spyOn(uibModal, 'open').and.returnValue({result: defer.promise});
                accountFactory.Update(currentProfile, newProfile);
                expect(uibModal.open).toHaveBeenCalled();
                scope.$digest();
                expect(oc.Auth.GetToken).toHaveBeenCalledWith({Username: 'FAKEUSERNAME', Password: 'FAKEPASSWORD'});
                expect(oc.Me.Update).toHaveBeenCalledWith(newProfile);
            })
        });

        describe('ChangePassword', function() {
            var currentUser = {
                ID: 'FAKEID',
                Username: 'FAKEUSERNAME',
                CurrentPassword: 'FAKECURRENTPASSWORD',
                NewPassword: 'FAKENEWPASSWORD'
            };
            it ('should check their password and update the user', function() {
                accountFactory.ChangePassword(currentUser);
                expect(oc.Auth.GetToken).toHaveBeenCalledWith({Username:currentUser.Username, Password:currentUser.CurrentPassword});
                scope.$digest();
                currentUser.Password = currentUser.NewPassword;
                expect(oc.Me.Update).toHaveBeenCalledWith(currentUser);
            })
        });
    });

    describe('Controller: AccountCtrl', function() {
        var accountCtrl, currentProfile;
        beforeEach(inject(function($state, $controller) {
            accountCtrl = $controller('AccountCtrl', {
                $scope: scope,
                CurrentUser: {}
            });
            spyOn($state, 'go').and.returnValue(true);
        }));

        describe('update', function() {
            beforeEach(inject(function() {
                accountCtrl.profile = account;
                currentProfile = {};
                var defer = q.defer();
                defer.resolve(account);
                spyOn(accountFactory, 'Update').and.returnValue(defer.promise);
                accountCtrl.update();
            }));
            it ('should call the Accounts Update method', inject(function(AccountService) {
                expect(accountFactory.Update).toHaveBeenCalledWith(currentProfile, account);
            }));
        });

        //describe('resetForm', function() {
        //    beforeEach(inject(function(form) {
        //        accountCtrl.profile = account;
        //        spyOn(form, '$setPristine').and.returnValue(null);
        //        accountCtrl.resetForm(form);
        //    }));
        //    it ('should set accountCtrl.profile to currentProfile', inject(function() {
        //        expect(accountCtrl.profile).toEqual({});
        //    }));
        //    it ('should call form.$setPristine method', inject(function(form) {
        //        expect(form.$setPristine).toHaveBeenCalledWith(true);
        //    }));
        //});
    });

    //describe('Controller: ConfirmPasswordCtrl', function() {
    //    var confirmPasswordCtrl;
    //    beforeEach(inject(function($state, $controller) {
    //        confirmPasswordCtrl = $controller('ConfirmPasswordCtrl', {
    //            $scope: scope
    //        });
    //        spyOn($state, 'go').and.returnValue(true);
    //    }));
    //
    //    describe('submit', function() {
    //        beforeEach(inject(function($uibModalInstance) {
    //            confirmPasswordCtrl.password = account.password;
    //            var defer = q.defer();
    //            defer.resolve(account);
    //            spyOn($uibModalInstance, 'close').and.returnValue(defer.promise);
    //            confirmPasswordCtrl.submit();
    //            scope.$digest();
    //        }));
    //        it ('should call the $uibModalInstance close method', inject(function($uibModalInstance) {
    //            expect($uibModalInstance.close).toHaveBeenCalledWith(confirmPasswordCtrl.password);
    //        }));
    //    });
    //
    //    describe('cancel', function() {
    //        beforeEach(inject(function($uibModalInstance) {
    //            confirmPasswordCtrl.password = account.password;
    //            var defer = q.defer();
    //            defer.resolve(account);
    //            spyOn($uibModalInstance, 'dismiss').and.returnValue(defer.promise);
    //            confirmPasswordCtrl.cancel();
    //            scope.$digest();
    //        }));
    //        it ('should call the $uibModalInstance close method', inject(function($uibModalInstance) {
    //            expect($uibModalInstance.dismiss).toHaveBeenCalledWith('cancel');
    //        }));
    //    });
    //});

    describe('Controller: ChangePasswordCtrl', function () {
        var changePasswordCtrl;
        beforeEach(inject(function($state, $controller) {
            changePasswordCtrl = $controller('ChangePasswordCtrl', {
                $scope: scope,
                CurrentUser: {}
            });
            spyOn($state, 'go').and.returnValue(true);
        }));
        describe('changePassword', function() {
            beforeEach(inject(function() {
                changePasswordCtrl.currentUser = account;
                var defer = q.defer();
                defer.resolve(account);
                spyOn(accountFactory, 'ChangePassword').and.returnValue(defer.promise);
                changePasswordCtrl.changePassword();
            }));
            it ('should call the Accounts ChangePassword method', inject(function(AccountService) {
                expect(accountFactory.ChangePassword).toHaveBeenCalledWith(changePasswordCtrl.currentUser);
            }));
        });

    });
});

