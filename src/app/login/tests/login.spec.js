describe('Component: Login', function() {
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
            it ('should initialize to login if there is not a token $stateParam', function() {
                expect(loginCtrl.form).toBe('login');
            });
            it ('should initialize to reset if token $stateParam exists', inject(function($controller) {
                var altLoginCtrl = $controller('LoginCtrl', {
                    $stateParams: {token:mock.OauthResponse.access_token}
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
                spyOn(loginFactory, 'SendVerificationCode').and.returnValue(deferred.promise);
                loginCtrl.forgotPassword();
                scope.$digest();
            });
            it ('should call the LoginService SendVerificationCode with the email', function() {
                expect(loginFactory.SendVerificationCode).toHaveBeenCalledWith(email);
            });
            it ('should set the form to verificationCodeSuccess', function() {
                expect(loginCtrl.form).toBe('verificationCodeSuccess');
            });
            it ('should set credentials.Email back to null', function() {
                expect(loginCtrl.credentials.Email).toBe(null);
            });
        });

        describe('resetPassword', function() {
            var creds = {
                ResetUsername: credentials.Username,
                NewPassword: credentials.Password,
                ConfirmPassword: credentials.Password
            };
            var token = 'reset';
            beforeEach(function() {
                loginCtrl.credentials = creds;
                loginCtrl.token = token;
                var deferred = q.defer();
                deferred.resolve(true);
                spyOn(loginFactory, 'ResetPassword').and.returnValue(deferred.promise);
                loginCtrl.resetPassword();
                scope.$digest();
            });
            it ('should call the ResetPassword method of the LoginService with credentials and token', function() {
                expect(loginFactory.ResetPassword).toHaveBeenCalledWith(creds, token);
            });
            it ('should set the form to resetSuccess', function() {
                expect(loginCtrl.form).toBe('resetSuccess');
            });
            it ('should set the token to null', function() {
                expect(loginCtrl.token).toBe(null);
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
