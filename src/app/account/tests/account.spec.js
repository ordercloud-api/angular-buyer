describe('Component: Account', function() {
    var ocAccountService,
        uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);
    beforeEach(inject(function(ocAccount) {
        ocAccountService = ocAccount;
    }));

    describe('Service: ocAccount', function() {
        var cookiesService, uibModal;
        beforeEach(inject(function($cookies, $uibModal) {
            cookiesService = $cookies;
            uibModal = $uibModal;
        }));

        describe('Method: ConfirmPassword', function() {
            it ('should check $cookies for oc_has_confirmed', function() {
                spyOn(cookiesService, 'get').and.callThrough();
                ocAccountService.ConfirmPassword();
                expect(cookiesService.get).toHaveBeenCalledWith('oc_has_confirmed.' + ocAppNameService.Watch())
            })
            it ('should not open the ConfirmPassword uibmodal if oc_has_confirmed is true', function() {
                spyOn(uibModal, 'open').and.callThrough();
                spyOn(cookiesService, 'get').and.returnValue(true);
                ocAccountService.ConfirmPassword();
                expect(uibModal.open).not.toHaveBeenCalled();
            })
            it ('should open the ConfirmPassword uibmodal if oc_has_confirmed is undefined', function() {
                spyOn(uibModal, 'open').and.callThrough();
                spyOn(cookiesService, 'get').and.returnValue(undefined);
                ocAccountService.ConfirmPassword();
                expect(uibModal.open).toHaveBeenCalledWith({
                    templateUrl: 'account/templates/confirmPassword.modal.html',
                    controller: 'ConfirmPasswordModalCtrl',
                    controllerAs: 'confirmPasswordModal',
                    size: 'confirm',
                    resolve: {
                        CurrentUser: jasmine.any(Function)
                    }
                });
            })
        })

        describe('Method: ChangePassword', function() {
            it ('should open the ChangePassword uibModal', function() {
                spyOn(uibModal, 'open').and.callThrough();
                ocAccountService.ChangePassword();
                expect(uibModal.open).toHaveBeenCalledWith({
                    templateUrl: 'account/templates/changePassword.modal.html',
                    controller: 'ChangePasswordModalCtrl',
                    controllerAs: 'changePasswordModal',
                    size: 'confirm',
                    resolve: {
                        CurrentUser: jasmine.any(Function)
                    }
                });
            })
        });
    });

    describe('Controller: AccountCtrl', function() {
        var accountCtrl,
            updatedUser = mock.User;
        updatedUser.ID = 'UPDATED';
        beforeEach(inject(function ($controller) {
            spyOn(ocAccountService, 'ConfirmPassword').and.returnValue(dummyPromise);
            accountCtrl = $controller('AccountCtrl', {
                CurrentUser: mock.User
            });
        }));
        it ('should set vm.profile to CurrentUser', function() {
            expect(accountCtrl.profile).toEqual(mock.User);
        })
        it ('should set vm.currentUser to CurrentUser', function() {
            expect(accountCtrl.currentUser).toEqual(mock.User);
        })
        describe('vm.updateProfile', function() {
            beforeEach(function() {
                var defer = q.defer();
                defer.resolve(updatedUser);
                spyOn(oc.Me, 'Patch').and.returnValue(defer.promise);
                accountCtrl.updateProfile();
                scope.$digest();
            })
            it ('should call ocAccount.ConfirmPassword()', function() {
                expect(ocAccountService.ConfirmPassword).toHaveBeenCalledWith(mock.User);
            })
            it ('should update FirstName, LastName, Email, and Phone when the password check passes', function() {
                expect(oc.Me.Patch).toHaveBeenCalledWith(_.pick(accountCtrl.profile, ['FirstName', 'LastName', 'Email', 'Phone']));
            })
            it ('should update the view model', function() {
                expect(accountCtrl.profile).toEqual(updatedUser);
                expect(accountCtrl.currentUser).toEqual(updatedUser);
            })
        })
        describe('vm.updateUsername', function() {
            beforeEach(function() {
                var defer = q.defer();
                defer.resolve(updatedUser);
                spyOn(oc.Me, 'Patch').and.returnValue(defer.promise);
                accountCtrl.updateUsername();
                scope.$digest();
            })
            it ('should call ocAccount.ConfirmPassword()', function() {
                expect(ocAccountService.ConfirmPassword).toHaveBeenCalledWith(mock.User);
            })
            it ('should update FirstName, LastName, Email, and Phone when the password check passes', function() {
                expect(oc.Me.Patch).toHaveBeenCalledWith(_.pick(accountCtrl.profile, ['Username']));
            })
            it ('should update the view model', function() {
                expect(accountCtrl.profile).toEqual(updatedUser);
                expect(accountCtrl.currentUser).toEqual(updatedUser);
            })
        })
        describe('vm.changePassword', function() {
            it('should call ocAccount.ChangePassword()', function() {
                spyOn(ocAccountService, 'ChangePassword').and.returnValue(dummyPromise);
                accountCtrl.changePassword();
                expect(ocAccountService.ChangePassword).toHaveBeenCalledWith(mock.User);
            })
        })
    });

    describe('Controller: ChangePasswordModalCtrl', function () {
        var changePasswordModalCtrl;
        var currentUser = mock.User;
        currentUser.CurrentPassword = "USER_CURRENTPASSWORD";
        beforeEach(inject(function($controller) {
            changePasswordModalCtrl = $controller('ChangePasswordModalCtrl', {
                CurrentUser: currentUser,
                $uibModalInstance: uibModalInstance,
                clientid: mock.ClientID,
                scope: mock.Scope
            });
        }));
        it ('should set vm.currentUser to CurrentUser', function() {
            expect(changePasswordModalCtrl.currentUser).toEqual(currentUser);
        })
        describe('vm.submit', function() {
            beforeEach(function() {
                spyOn(oc.Auth, 'Login').and.returnValue(dummyPromise);
                spyOn(oc.Me, 'ResetPasswordByToken').and.returnValue(dummyPromise);
                changePasswordModalCtrl.submit();
                scope.$digest();
            })
            it('should attempt to log the user in', function() {
                expect(oc.Auth.Login).toHaveBeenCalledWith(changePasswordModalCtrl.currentUser.Username, changePasswordModalCtrl.currentUser.CurrentPassword, mock.ClientID, mock.Scope)
            })
            it('should call OrderCloudSDK.Me.ResetPasswordByToken()', function() {
                expect(oc.Me.ResetPasswordByToken).toHaveBeenCalledWith({NewPassword:changePasswordModalCtrl.currentUser.NewPassword})
            })
            it('should close the modal', function() {
                expect(uibModalInstance.close).toHaveBeenCalled();
            });
        });
        describe('vm.cancel', function() {
            it('should dismiss the modal', function(){
                changePasswordModalCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
    });
    describe('Controller: ConfirmPasswordModalCtrl', function () {
        var confirmPasswordModalCtrl, cookiesService;
        beforeEach(inject(function($controller, $cookies) {
            cookiesService = $cookies;
            confirmPasswordModalCtrl = $controller('ConfirmPasswordModalCtrl', {
                $uibModalInstance: uibModalInstance,
                CurrentUser: mock.User,
                clientid: mock.ClientID,
                scope: mock.Scope,
                $cookies: cookiesService
            });
            confirmPasswordModalCtrl.password = mock.User.Password;
        }));
        describe('vm.submit', function() {
            beforeEach(function() {
                spyOn(oc.Auth, 'Login').and.returnValue(dummyPromise);
                spyOn(cookiesService, 'put').and.callThrough;
                confirmPasswordModalCtrl.submit();
                scope.$digest();
            })
            it('should attempt to log the user in', function() {
                expect(oc.Auth.Login).toHaveBeenCalledWith(mock.User.Username, confirmPasswordModalCtrl.password, mock.ClientID, mock.Scope)
            })
            it('should store the oc_has_confirmed cookie if successful', function() {
                expect(cookiesService.put).toHaveBeenCalledWith('oc_has_confirmed.' + ocAppNameService.Watch(), true, {
					expires: jasmine.any(Date)
				})
            })
            it('should close the modal', function() {
                expect(uibModalInstance.close).toHaveBeenCalled();
            });
        });
        describe('vm.cancel', function() {
            it('should dismiss the modal', function(){
                confirmPasswordModalCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
    });
});

