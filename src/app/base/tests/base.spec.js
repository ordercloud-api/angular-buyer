describe('Component: Base', function() {
    var q,
        scope,
        oc,
        buyerid = "BUYERID",
        state,
        productSearch,
        injector;
    beforeEach(module('orderCloud'));
    beforeEach(module('ordercloud-angular-sdk'));
    beforeEach(module('ui.router'));
    beforeEach(inject(function($q, $rootScope, $state, OrderCloudSDK, ocProductSearch, $injector) {
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloudSDK;
        state = $state;
        injector = $injector;
        productSearch = ocProductSearch;
    }));
    describe('State: Base', function() {
        var base;
        beforeEach(function() {
            base = state.get('base');
        });
        it('should resolve CurrentUser - get current user', function() {
            var user = q.defer();
            user.resolve('TEST USER');
            spyOn(oc.Me, 'Get').and.returnValue(user.promise);
            injector.invoke(base.resolve.CurrentUser, scope, {$q:q, $state:state, OrderCloud:oc, buyerid:buyerid});
            expect(oc.Me.Get).toHaveBeenCalled();
            scope.$digest();
        });
        it('resolve ExistingOrder - attempt to get existing order', function() {
            var orderList = q.defer();
            orderList.resolve({Items:['TEST ORDER']});
            spyOn(oc.Me, 'ListOrders').and.returnValue(orderList.promise);
            var currentUser = injector.invoke(base.resolve.CurrentUser);
            injector.invoke(base.resolve.ExistingOrder, scope, {$q:q, OrderCloud:oc, CurrentUser:currentUser});
            var options = {
                page: 1,
                pageSize: 1,
                sortBy: '!DateCreated',
                filters: {Status: 'Unsubmitted'}
            };
            expect(oc.Me.ListOrders).toHaveBeenCalledWith(options);
        });
        it('resolve CurrentOrder - if ExistingOrder is defined, return it, else create a new order', inject(function(ocNewOrder) {
            var newOrder = ocNewOrder,
                existingOrder, //undefined existing order
                currentUser = injector.invoke(base.resolve.CurrentUser);
            spyOn(newOrder, 'Create');
            injector.invoke(base.resolve.CurrentOrder, scope, {ExistingOrder: existingOrder, NewOrder: newOrder, CurrentUser: currentUser});
            expect(newOrder.Create).toHaveBeenCalledWith({});
        }));
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
        it('should initialize the current user and order into its scope', function() {
            expect(baseCtrl.currentUser).toBe(fake_user);
            expect(baseCtrl.currentOrder).toBe(fake_order);
        });

        describe('mobileSearch', function(){
            var productID,
            searchTerm
            beforeEach(function(){
                productID = 'mockProductID';
                searchTerm = 'mockSearchTerm';
                spyOn(state, 'go');
            });
            it('should go to productDetail if ocProductSearch returns a productID', function(){
                var d = q.defer();
                d.resolve({productID: productID});
                spyOn(productSearch, 'Open').and.returnValue(d.promise);
                baseCtrl.mobileSearch();
                scope.$digest();
                expect(productSearch.Open).toHaveBeenCalled();
                expect(state.go).toHaveBeenCalledWith('productDetail', {productid: productID});
            });
            it('should go to productSearchResults if ocProductSearch doesnt return a productID', function(){
                var d = q.defer();
                d.resolve({searchTerm: searchTerm});
                spyOn(productSearch, 'Open').and.returnValue(d.promise);
                baseCtrl.mobileSearch();
                scope.$digest();
                expect(productSearch.Open).toHaveBeenCalled();
                expect(state.go).toHaveBeenCalledWith('productSearchResults', {searchTerm: searchTerm});
            });
        });
    });
});
