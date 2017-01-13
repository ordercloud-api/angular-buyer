describe('Component: Base', function() {
    var q,
        scope,
        oc,
<<<<<<< HEAD
        underscore;
    beforeEach(module('orderCloud'));
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
=======
        buyerid = "BUYERID",
        state,
        injector;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module('ui.router'));
    beforeEach(inject(function($q, $rootScope, $state, OrderCloud, $injector) {
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloud;
        state = $state;
        injector = $injector;
    }));
    describe('State: Base', function() {
        var base;
        beforeEach(function() {
            base = state.get('base');
        });
        it ('should attempt to get the current user and set the buyerid', function() {
            var user = q.defer();
            user.resolve('TEST USER');
            spyOn(oc.Me, 'Get').and.returnValue(user.promise);
            spyOn(oc.BuyerID, 'Set').and.callThrough();
            injector.invoke(base.resolve.CurrentUser, scope, {$q:q, $state:state, OrderCloud:oc, buyerid:buyerid});
            expect(oc.Me.Get).toHaveBeenCalled();
            scope.$digest();
            expect(oc.BuyerID.Set).toHaveBeenCalledWith('BUYERID');
        });
        it ('should search for an existing unsubmitted order', function() {
            var orderList = q.defer();
            orderList.resolve({Items:['TEST ORDER']});
            spyOn(oc.Me, 'ListOutgoingOrders').and.returnValue(orderList.promise);
            var currentUser = injector.invoke(base.resolve.CurrentUser);
            injector.invoke(base.resolve.ExistingOrder, scope, {$q:q, OrderCloud:oc, CurrentUser:currentUser});
            expect(oc.Me.ListOutgoingOrders).toHaveBeenCalledWith(null, 1, 1, null, "!DateCreated", {Status: "Unsubmitted"});
        });
        it ('should create a new order if there is not an existing unsubmitted order', inject(function(NewOrder) {
            var newOrder = NewOrder,
                existingOrder, //undefined existing order
                currentUser = injector.invoke(base.resolve.CurrentUser);
            spyOn(newOrder, 'Create');
            injector.invoke(base.resolve.CurrentOrder, scope, {ExistingOrder: existingOrder, NewOrder: newOrder, CurrentUser: currentUser});
            expect(newOrder.Create).toHaveBeenCalledWith({});
        }))
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
    });

    describe('Controller: BaseCtrl', function(){
        var baseCtrl,
            fake_user = {
                Username: 'notarealusername',
                Password: 'notarealpassword'
<<<<<<< HEAD
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
                ComponentList: fake_components,
                Order: null
            });
        }));
        it ('should initialize the components lists', function() {
            expect(baseLeftCtrl.catalogItems).toBe(fake_components.nonSpecific);
            expect(baseLeftCtrl.organizationItems).toBe(fake_components.buyerSpecific);
        });
    });

    describe('Controller: BaseTopCtrl', function(){
        var baseTopCtrl;
        beforeEach(inject(function($controller) {
            baseTopCtrl = $controller('BaseTopCtrl', {});
        }));
        /* No tests needed */
    });
=======
            },
            fake_order = {
                ID: 'fakeorder'
            };
        beforeEach(inject(function($controller) {
            baseCtrl = $controller('BaseCtrl', {
                CurrentUser: fake_user,
                CurrentOrder: fake_order
            });
        }));
        it ('should initialize the current user and order into its scope', function() {
            expect(baseCtrl.currentUser).toBe(fake_user);
            expect(baseCtrl.currentOrder).toBe(fake_order);
        });
    });
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
});
