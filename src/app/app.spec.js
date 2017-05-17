describe('Runtime', function() {
    var ocStateLoading;
    beforeEach(inject(function(_ocStateLoading_) {
        ocStateLoading = _ocStateLoading_;
    }));

    it('should initialize the ocStateLoading service', function() {
        expect(ocStateLoading.Init).toHaveBeenCalled();
    });
});

describe('Application', function() {
    var stateLoading;
    beforeEach(inject(function(ocStateLoading) {
        stateLoading = ocStateLoading;
    }));

    describe('Controller: AppCtrl', function(){
        var appController, ocMedia, ocAppNameService, isTouchDevice, ocRolesService;
        beforeEach(inject(function($controller, $ocMedia, ocAppName, ocIsTouchDevice, ocRoles) {
            ocMedia = $ocMedia;
            ocAppNameService = ocAppName;
            isTouchDevice = ocIsTouchDevice;
            ocRolesService = ocRoles;
            appController = $controller('AppCtrl', {
                $state: state,
                $ocMedia: ocMedia,
                ocAppName: ocAppNameService,
                ocStateLoading: stateLoading,
                ocIsTouchDevice: isTouchDevice,
                ocRoles: ocRolesService
            });
        }));
        it('should set vm.name to ocAppName.Watch', function() {
            expect(appController.name).toEqual(ocAppNameService.Watch);
        });
        it('should set vm.$state to $state', function() {
            expect(appController.$state).toEqual(state);
        });
        it('should set vm.$ocMedia to $ocMedia', function() {
            expect(appController.$ocMedia).toEqual(ocMedia);
        });
        it('should set vm.isTouchDevice to ocIsTouchDevice', function() {
            expect(appController.isTouchDevice).toEqual(isTouchDevice);
        });
        it('should set vm.stateLoading to ocStateLoading', function() {
            expect(appController.stateLoading).toEqual(stateLoading.Watch);
        });
        it('should set vm.logout to OrderCloudSDK.Auth.Logout', function() {
            expect(appController.logout).toEqual(oc.Auth.Logout);
        });
        it('should set vm.userIsAuthorized to ocRoles.UserIsAuthorized', function() {
            expect(appController.userIsAuthorized).toEqual(ocRolesService.UserIsAuthorized);
        });
    });
});