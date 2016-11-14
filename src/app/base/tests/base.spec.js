describe('Component: Base', function() {
    var q,
        scope,
        oc,
        underscore;
    beforeEach(module('orderCloud', function($provide){
       $provide.value('ComponentList', {});
    }));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module('ui.router'));
    beforeEach(inject(function($q, $rootScope, OrderCloud, Underscore) {
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloud;
        underscore = Underscore;
    }));
    describe('State: Base', function() {
        var state;
        beforeEach(inject(function($state) {
            state = $state.get('base');
            var dfd = q.defer();
            dfd.resolve(true);
            spyOn(oc.BuyerID, 'Set').and.callThrough();
            spyOn(oc.Auth, 'RemoveToken').and.callThrough();
            spyOn(oc.Auth, 'RemoveImpersonationToken').and.callThrough();
            spyOn($state, 'go').and.returnValue(true);
        }));
        //Skipped this test because Base now resolves with Auth.IsAuthenticated and THEN do a Me.Get() to confirm the token will work
        it('should resolve CurrentUser', inject(function ($injector) {
            var dfd = q.defer();
            dfd.resolve('TEST USER');
            spyOn(oc.Me, 'Get').and.returnValue(dfd.promise);
            $injector.invoke(state.resolve.CurrentUser);
            expect(oc.Me.Get).toHaveBeenCalled();
        }));
        it('should remove Auth tokens, set BuyerID to null, and return to login if unauthenticated', inject(function($injector, $state) {
            var dfd = q.defer();
            dfd.reject(true);
            spyOn(oc.Me, 'Get').and.returnValue(dfd.promise);
            $injector.invoke(state.resolve.CurrentUser);
            scope.$digest();
            expect(oc.Auth.RemoveToken).toHaveBeenCalled();
            expect(oc.Auth.RemoveImpersonationToken).toHaveBeenCalled();
            expect(oc.BuyerID.Set).toHaveBeenCalledWith(null);
            expect($state.go).toHaveBeenCalledWith('login');
        }));
        it ('should resolve ComponentsList', inject(function($injector, $state) {
            var currentUser = $injector.invoke(state.resolve.CurrentUser);
            var components = $injector.invoke(state.resolve.ComponentList, scope, {$state: $state, $q: q, Underscore: underscore, CurrentUser: currentUser});
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
});
