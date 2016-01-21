describe('Component: Account', function() {
    var scope,
        q,
        account;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope) {
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
    }));

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
            beforeEach(inject(function(AccountService) {
                accountCtrl.profile = account;
                currentProfile = {};
                var defer = q.defer();
                defer.resolve(account);
                spyOn(AccountService, 'Update').and.returnValue(defer.promise);
                accountCtrl.update();
            }));
            it ('should call the Accounts Update method', inject(function(AccountService) {
                expect(AccountService.Update).toHaveBeenCalledWith(currentProfile, account);
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
            beforeEach(inject(function(AccountService) {
                changePasswordCtrl.currentUser = account;
                var defer = q.defer();
                defer.resolve(account);
                spyOn(AccountService, 'ChangePassword').and.returnValue(defer.promise);
                changePasswordCtrl.changePassword();
            }));
            it ('should call the Accounts ChangePassword method', inject(function(AccountService) {
                expect(AccountService.ChangePassword).toHaveBeenCalledWith(changePasswordCtrl.currentUser);
            }));
        });

    });
});

