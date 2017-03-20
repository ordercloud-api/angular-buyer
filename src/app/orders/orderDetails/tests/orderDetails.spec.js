describe('Component: orderDetails', function() {
    var scope,
        q,
        oc,
        _ocOrderDetails,
        mockOrderID,
        mockBuyerID,
        mockCurrentUser,
        mockParams,
        stateParams
        ;
    beforeEach(module(function($provide) {
        mockCurrentUser = 'CurrentUser123';
        mockOrderID = 'OrderID123';
        mockBuyerID = 'Buyer123';
        mockParams = {search:null, page: null, pageSize: null, searchOn: null, sortBy: null, filters: null, from: null, to: null, favorites: null};
        stateParams =  {buyerid: mockBuyerID, orderid: mockOrderID};
        $provide.value('CurrentUser', mockCurrentUser);
        $provide.value('Parameters', mockParams);
    }));
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope, OrderCloud, ocParameters, ocOrderDetails) {
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloud;
        _ocOrderDetails = ocOrderDetails;
    }));



    describe('State: orderDetails', function() {
        var state
            ;
        beforeEach(inject(function($state, $stateParams) {
            $stateParams.orderid = stateParams.orderid;
            $stateParams.buyerid = stateParams.buyerid;
            state = $state.get('orderDetail');
            spyOn(_ocOrderDetails, 'Get');
            spyOn(oc.LineItems, 'List');
        }));
        it('should resolve SelectedOrder', inject(function($injector){
            $injector.invoke(state.resolve.SelectedOrder);
            expect(_ocOrderDetails.Get).toHaveBeenCalledWith(mockOrderID);
        }));
        it('should resolve OrderLineItems', inject(function($injector) {
            $injector.invoke(state.resolve.OrderLineItems);
            expect(oc.LineItems.List).toHaveBeenCalledWith(mockOrderID, null, 1, null, null, null, null, mockBuyerID);
        }));
    });



    describe('Controller: OrderDetailsCtrl', function(){
        var orderDetailsCtrl,
            mockMeta,
            mockResponse
        ;
        beforeEach(inject(function($controller, $stateParams){
            $stateParams = stateParams;
            mockMeta = {Page: 2, PageSize: 15};
            mockResponse = {Items: [{Name: 'LineItem2'}, {Name:'LineItem3'}], Meta: mockMeta};

            orderDetailsCtrl = $controller('OrderDetailsCtrl', {
                $stateParams: $stateParams,
                OrderCloud: oc,
                SelectedOrder: {ID: 'Order123', Name:'mockSelectedOrder'},
                OrderLineItems: {Meta: {Page: 1, PageSize: 12}, Items: [{Name: 'LineItem1'}] }
            });

            var defer = q.defer();
            defer.resolve(mockResponse);
            spyOn(oc.LineItems, 'List').and.returnValue(defer.promise);
        }));


        describe('pageChanged', function(){
            it('should update results with page from vm.lineItems.Meta.Page', function(){
                var mockPage = 3;
                orderDetailsCtrl.lineItems.Meta.Page = mockPage;
                orderDetailsCtrl.pageChanged();
                expect(oc.LineItems.List).toHaveBeenCalledWith(mockOrderID, null, mockPage, 12, null, null, null, mockBuyerID);
                scope.$digest();
                expect(orderDetailsCtrl.lineItems).toEqual(mockResponse);
            });
        });


        describe('loadMore', function(){
            it('should concatenate next page of results with current list items', function(){
                var nextPage = orderDetailsCtrl.lineItems.Meta.Page + 1;
                orderDetailsCtrl.loadMore();
                expect(oc.LineItems.List).toHaveBeenCalledWith(mockOrderID, null, nextPage, 12, null, null, null, mockBuyerID);
                scope.$digest();
                expect(orderDetailsCtrl.lineItems.Meta.Page).toBe(nextPage);
                expect(orderDetailsCtrl.lineItems.Items).toEqual([{Name:'LineItem1'}, {Name: 'LineItem2'}, {Name:'LineItem3'}]);
            });
        });
    });
});