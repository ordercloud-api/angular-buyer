fdescribe('Component: Login', function() {
    describe('Controller: LoginCtrl', function() {
        var loginCtrl;
        beforeEach(inject(function($controller) {
            spyOn(state, 'go').and.callThrough();
            spyOn(oc, 'SetToken').and.callThrough();
            spyOn(oc, 'SetRefreshToken').and.callThrough();
            var loginDefer = q.defer();
            loginDefer.resolve(mock.OauthResponse);
            spyOn(oc.Auth, 'Login').and.returnValue(loginDefer.promise);
            loginCtrl = $controller('LoginCtrl', {
                clientid: mock.ClientID,
                scope: mock.Scope,
                defaultstate: mock.DefaultState,
                ocRoles: { //overwrite ocRoles.Set() to return mock.Scope
                    Set: function() {
                        return mock.Scope;
                    }
                }
            });
        }));

        describe('form', function() {
            it ('should initialize to login if there is not a validationCode $stateParam', function() {
                expect(loginCtrl.form).toBe('login');
            });
            it ('should initialize to reset if validationCode $stateParam exists', inject(function($controller) {
                var altLoginCtrl = $controller('LoginCtrl', {
                    $stateParams: {validationCode: 'mockValidationCode'}
                })
                expect(altLoginCtrl.form).toBe('reset');
            }));
        });

        describe('setForm', function() {
            it ('should change the value of form to the passed in value', function() {
                loginCtrl.setForm('reset');
                expect(loginCtrl.form).toBe('reset');
            });
        });

        describe('submit', function() {
            beforeEach(function() {
                loginCtrl.credentials = {Username: mock.User.Username, Password:mock.User.Password};
                loginCtrl.submit();
            });
            it ('should call OrderCloud.Auth.Login with credentials', function() {
                scope.$digest();
                expect(oc.Auth.Login).toHaveBeenCalledWith(mock.User.Username, mock.User.Password, mock.ClientID, mock.Scope);
            });
            it ('should call OrderCloud.SetToken()', function() {
                scope.$digest();
                expect(oc.SetToken).toHaveBeenCalledWith(mock.OauthResponse.access_token);
            });
            it ('should call OrderCloud.RefreshToken() if vm.rememberStatus is true', function() {
                loginCtrl.rememberStatus = true;
                scope.$digest();
                expect(oc.SetRefreshToken).toHaveBeenCalledWith(mock.OauthResponse.refresh_token);
            });
            it ('should enter the default state', function() {
                scope.$digest();
                expect(state.go).toHaveBeenCalledWith(mock.DefaultState);
            });
        });

        describe('forgotPassword', function() {
            var email = 'test@test.com';
            beforeEach(function() {
                loginCtrl.credentials = {
                    Email: email
                };
                var deferred = q.defer();
                deferred.resolve(true);
                spyOn(oc.PasswordResets, 'SendVerificationCode').and.returnValue(deferred.promise);
                loginCtrl.forgotPassword();
                scope.$digest();
            });
            it ('should call the LoginService SendVerificationCode with the email', inject(function($window) {
                expect(oc.PasswordResets.SendVerificationCode).toHaveBeenCalledWith({Email: email, ClientID: mock.ClientID, URL: encodeURIComponent($window.location.href) + '{0}'});
            }));
            it ('should set the form to verificationCodeSuccess', function() {
                expect(loginCtrl.form).toBe('verificationCodeSuccess');
            });
            it ('should set credentials.Email back to null', function() {
                expect(loginCtrl.credentials.Email).toBe(null);
            });
        });

        describe('resetPassword', function() {
            var mockCreds = {
                ClientID: mock.ClientID,
                Username: mock.User.Username,
                Password: mock.User.Password
            };
            var mockValidationCode = 'mockValidation';
            beforeEach(function() {
                loginCtrl.credentials = {ResetUsername: mock.User.Username, NewPassword: mock.User.Password};
                loginCtrl.validationCode = mockValidationCode;
                spyOn(oc.PasswordResets, 'ResetPasswordByVerificationCode').and.returnValue(dummyPromise);
                loginCtrl.resetPassword();
                scope.$digest();
            });
            it ('should call the ResetPassword method of the LoginService with credentials and token', function() {
                expect(oc.PasswordResets.ResetPasswordByVerificationCode).toHaveBeenCalledWith(mockValidationCode, mockCreds);
            });
            it ('should set the form to resetSuccess', function() {
                expect(loginCtrl.form).toBe('resetSuccess');
            });
            it ('should set the credentials values to null', function() {
                for (key in loginCtrl.credentials) {
                    if (loginCtrl.credentials.hasOwnProperty(key)) {
                        expect(loginCtrl.credentials[key]).toBe(null);
                    }
                }
            });
        });
    });
});
