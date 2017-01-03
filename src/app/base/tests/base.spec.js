describe('Component: Base', function() {
    var q,
        scope,
        oc,
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
    });

    describe('Controller: BaseCtrl', function(){
        var baseCtrl,
            fake_user = {
                Username: 'notarealusername',
                Password: 'notarealpassword'
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
});
