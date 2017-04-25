describe('Component: Base', function() {
    var productSearch;
    beforeEach(inject(function(ocProductSearch) {
        productSearch = ocProductSearch;
    }));
    describe('State: Base', function() {
        var base;
        beforeEach(function() {
            base = state.get('base');
        });
        it('should resolve CurrentUser', function() {
            var user = q.defer();
            user.resolve(mock.User);
            spyOn(oc.Me, 'Get').and.returnValue(user.promise);
            injector.invoke(base.resolve.CurrentUser, scope, {$q:q, $state:state, OrderCloud:oc, buyerid:mock.Buyer.ID});
            expect(oc.Me.Get).toHaveBeenCalled();
            scope.$digest();
        });
        it('should resolve ExistingOrder', function() {
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
        it('should resolve CurrentOrder - if ExistingOrder is undefined create a new order', inject(function(ocNewOrder) {
            var existingOrder, //undefined existing order
                currentUser = injector.invoke(base.resolve.CurrentUser);
            spyOn(ocNewOrder, 'Create');
            injector.invoke(base.resolve.CurrentOrder, scope, {ExistingOrder: existingOrder, NewOrder: ocNewOrder, CurrentUser: currentUser});
            expect(ocNewOrder.Create).toHaveBeenCalledWith({});
        }));
    });

    describe('Controller: BaseCtrl', function(){
        var baseCtrl;
        beforeEach(inject(function($controller) {
            baseCtrl = $controller('BaseCtrl', {
                CurrentUser: mock.User,
                CurrentOrder: mock.Order
            });
        }));
        it('should initialize the current user and order into its scope', function() {
            expect(baseCtrl.currentUser).toBe(mock.User);
            expect(baseCtrl.currentOrder).toBe(mock.Order);
        });

        describe('mobileSearch', function(){
            beforeEach(function(){
                spyOn(state, 'go');
            });
            it('should go to productDetail if ocProductSearch returns a productID', function(){
                var d = q.defer();
                d.resolve({productID: mock.Product.ID});
                spyOn(productSearch, 'Open').and.returnValue(d.promise);
                baseCtrl.mobileSearch();
                scope.$digest();
                expect(productSearch.Open).toHaveBeenCalled();
                expect(state.go).toHaveBeenCalledWith('productDetail', {productid: mock.Product.ID});
            });
            it('should go to productSearchResults if ocProductSearch doesnt return a productID', function(){
                var d = q.defer();
                d.resolve({searchTerm: 'SEARCHTERM'});
                spyOn(productSearch, 'Open').and.returnValue(d.promise);
                baseCtrl.mobileSearch();
                scope.$digest();
                expect(productSearch.Open).toHaveBeenCalled();
                expect(state.go).toHaveBeenCalledWith('productSearchResults', {searchTerm: 'SEARCHTERM'});
            });
        });
    });
});
