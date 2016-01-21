describe('Component: Login', function() {
    var scope,
        q,
        loginFactory,
        credentials = {
            Username: 'notarealusername',
            Password: 'notarealpassword'
        };
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope, LoginService) {
        q = $q;
        scope = $rootScope.$new();
        loginFactory = LoginService
    }));

    describe('Factory: LoginService', function() {
        var PasswordResetsFactory,
            client_id;
        beforeEach(inject(function(PasswordResets, clientid) {
            PasswordResetsFactory = PasswordResets;
            client_id = clientid;
        }));
        describe('SendVerificationCode', function() {
            var passwordResetRequest;
            beforeEach(inject(function($window) {
                var email = 'test@test.com';
                passwordResetRequest = {
                    Email: email,
                    ClientID: client_id,
                    URL: encodeURIComponent($window.location.href) + '{0}'
                };
                var deferred = q.defer();
                deferred.resolve(true);
                spyOn(PasswordResetsFactory, 'SendVerificationCode').and.returnValue(deferred.promise);
                loginFactory.SendVerificationCode(email);
            }));
            it ('should call the SendVerificationCode method of PasswordResets with the reset request object', function(){
                expect(PasswordResetsFactory.SendVerificationCode).toHaveBeenCalledWith(passwordResetRequest);
            });
        });

        describe('ResetPassword', function() {
            var creds = {
                ResetUsername: credentials.Username,
                NewPassword: credentials.Password,
                ConfirmPassword: credentials.Password
            };
            beforeEach(inject(function() {
                var deferred = q.defer();
                deferred.resolve(true);
                spyOn(PasswordResetsFactory, 'ResetPassword').and.returnValue(deferred.promise);
                loginFactory.ResetPassword(creds, 'code');
            }));
            it ('should call the ResetPassword method of the PasswordResets Service with a code and credentials', function() {
                expect(PasswordResetsFactory.ResetPassword).toHaveBeenCalledWith('code', {ClientID: client_id, Username: creds.ResetUsername, Password: creds.NewPassword});
            });
        });
    });

    describe('Controller: LoginCtrl', function() {
        var loginCtrl;
        beforeEach(inject(function($controller, $state, Credentials, LoginService) {
            spyOn($state, 'go').and.callThrough();
            var dfd = q.defer();
            dfd.resolve(true);
            spyOn(Credentials, 'Get').and.returnValue(dfd.promise);
            loginCtrl = $controller('LoginCtrl', {
                $scope: scope,
                LoginService: LoginService,
                Credentials: Credentials
            });
        }));

        describe('form', function() {
            it ('should initialize to login', function() {
                expect(loginCtrl.form).toBe('login');
            });
        });

        describe('setForm', function() {
            it ('should change the value of form to the passed in value', function() {
                loginCtrl.setForm('reset');
                expect(loginCtrl.form).toBe('reset');
            });
        });

        describe('submit', function() {
            beforeEach(function() {
                loginCtrl.credentials = credentials;
                loginCtrl.submit();
            });
            it ('should call the Credentials Get method with credentials', inject(function(Credentials) {
                expect(Credentials.Get).toHaveBeenCalledWith(credentials);
            }));
            it ('should enter the home state', inject(function($state) {
                scope.$digest();
                expect($state.go).toHaveBeenCalledWith('home');
            }));
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
