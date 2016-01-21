describe('Component: Base', function() {
    var q,
        scope;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module('ui.router'));
    beforeEach(inject(function($q, $rootScope) {
        q = $q;
        scope = $rootScope.$new();
    }));
    describe('State: Base', function() {
        var state;
        beforeEach(inject(function($state, Me, BuyerID) {
            state = $state.get('base');
            var dfd = q.defer();
            dfd.resolve(true);
            spyOn(Me, 'Get').and.returnValue(dfd.promise);
            spyOn(BuyerID, 'Set').and.callThrough();
            spyOn($state, 'go').and.returnValue(true);
        }));
        //Skipped this test because Base now resolves with Auth.IsAuthenticated and THEN do a Me.Get() to confirm the token will work
        it('should resolve CurrentUser', inject(function ($injector, Me, Auth) {
            var dfd = q.defer();
            dfd.resolve(true);
            spyOn(Auth, 'IsAuthenticated').and.returnValue(dfd.promise);
            $injector.invoke(state.resolve.CurrentUser);
            scope.$digest();
            expect(Me.Get).toHaveBeenCalled();
        }));
        it('should return to login if unauthenticated', inject(function($injector, Auth, BuyerID, $state) {
            var dfd = q.defer();
            dfd.reject(true);
            spyOn(Auth, 'IsAuthenticated').and.returnValue(dfd.promise);
            $injector.invoke(state.resolve.CurrentUser);
            scope.$digest();
            expect(BuyerID.Set).toHaveBeenCalledWith(null);
            expect($state.go).toHaveBeenCalledWith('login');
        }));
        it ('should resolve ComponentsList', inject(function($injector) {
            var components = $injector.invoke(state.resolve.ComponentList);
            expect(components.nonSpecific).not.toBe(null);
            expect(components.buyerSpecific).not.toBe(null);
        }));
    });

    describe('Controller: BaseCtrl', function(){
        var baseCtrl,
            fake_user = {
                Username: 'notarealusername',
                Password: 'notarealpassword'
            };
        beforeEach(inject(function($controller) {
            baseCtrl = $controller('BaseCtrl', {
                CurrentUser: fake_user
            });
        }));
        it ('should initialize the currentUser into its scope', function() {
            expect(baseCtrl.currentUser).toBe(fake_user);
        });
    });

    describe('Controller: BaseLeftCtrl', function(){
        var baseLeftCtrl,
            fake_components = {
                nonSpecific: ['test1', 'test2', 'test3'],
                buyerSpecific: ['test4', 'test5', 'test6']
            };
        beforeEach(inject(function($controller) {
            baseLeftCtrl = $controller('BaseLeftCtrl', {
                ComponentList: fake_components
            });
        }));
        it ('should initialize the components lists', function() {
            expect(baseLeftCtrl.catalogItems).toBe(fake_components.nonSpecific);
            expect(baseLeftCtrl.organizationItems).toBe(fake_components.buyerSpecific);
        });
        it ('should initialize isCollapsed to true', function() {
            expect(baseLeftCtrl.isCollapsed).toBe(true);
        });
    });

    describe('Controller: BaseTopCtrl', function(){
        var baseTopCtrl;
        beforeEach(inject(function($controller) {
            baseTopCtrl = $controller('BaseTopCtrl', {});
        }));
        /* No tests needed */
    });
});
