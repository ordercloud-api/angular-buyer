describe('Runtime', function() {
    var ocStateLoading;

    beforeEach(function() {
        module('orderCloud', function($provide) {
            $provide.value('ocStateLoading', {
                'Init': jasmine.createSpy()
            });
        });

        inject(function(_ocStateLoading_) {
            ocStateLoading = _ocStateLoading_;
        })
    });

    it ('should initialize the ocStateLoading service', function() {
        expect(ocStateLoading.Init).toHaveBeenCalled();
    });
});

describe('Application', function() {
    var q,
        scope,
        oc,
        stateLoading;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module('ui.router'));
    beforeEach(inject(function($q, $rootScope, OrderCloud, ocStateLoading) {
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloud;
        stateLoading = ocStateLoading;
    }));

    describe('Controller: AppCtrl', function(){
        var appController, stateSvc, ocMedia, loginFactory, applicationName, isTouchDevice, rolesService;
        beforeEach(inject(function($controller, $state, $ocMedia, LoginService, appname, ocIsTouchDevice, ocRolesService) {
            stateSvc = $state;
            ocMedia = $ocMedia;
            loginFactory = LoginService;
            applicationName = appname;
            isTouchDevice = ocIsTouchDevice;
            rolesService = ocRolesService;
            appController = $controller('AppCtrl', {
                $state: stateSvc,
                $ocMedia: ocMedia,
                LoginService: loginFactory,
                appname: applicationName,
                ocStateLoading: stateLoading,
                ocIsTouchDevice: isTouchDevice,
                ocRolesService: rolesService
            })
        }));
        it ('should set vm.name to appname', function() {
            expect(appController.name).toEqual(applicationName);
        });
        it ('should set vm.$state to $state', function() {
            expect(appController.$state).toEqual(stateSvc);
        });
        it ('should set vm.$ocMedia to $ocMedia', function() {
            expect(appController.$ocMedia).toEqual(ocMedia);
        });
        it ('should set vm.isTouchDevice to ocIsTouchDevice', function() {
            expect(appController.isTouchDevice).toEqual(isTouchDevice);
        });
        it ('should set vm.stateLoading to ocStateLoading', function() {
            expect(appController.stateLoading).toEqual(stateLoading.Watch);
        });
        it ('should set vm.logout to LoginService.Logout', function() {
            expect(appController.logout).toEqual(loginFactory.Logout);
        });
        it ('should set vm.userIsAuthorized to ocRolesService.UserIsAuthorized', function() {
            expect(appController.userIsAuthorized).toEqual(rolesService.UserIsAuthorized);
        });
    });
});