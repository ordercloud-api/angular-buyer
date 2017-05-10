describe('Component: orderDetails', function() {

    var _ocOrderDetails;
    beforeEach(inject(function(ocOrderDetails) {
        _ocOrderDetails = ocOrderDetails;
    }));

    describe('State: orderDetails', function() {
        var orderDetailsState,
            orderID;
        beforeEach(function() {
            orderDetailsState = state.get('orderDetail');
            spyOn(_ocOrderDetails, 'Get');
            spyOn(oc.LineItems, 'List');
        });
        it('should resolve SelectedOrder', function(){
            injector.invoke(orderDetailsState.resolve.SelectedOrder);
            expect(_ocOrderDetails.Get).toHaveBeenCalledWith(orderID);
        });
        it('should resolve OrderLineItems', function() {
            var direction = 'outgoing';
            injector.invoke(orderDetailsState.resolve.OrderLineItems);
            expect(oc.LineItems.List).toHaveBeenCalledWith(direction, orderID);
        });
    });

    describe('Controller: OrderDetailsCtrl', function(){
        var orderDetailsCtrl,
            mockMeta,
            mockResponse;
        beforeEach(inject(function($controller){
            mockMeta = {Page: 2, PageSize: 15};
            mockResponse = {Items: [{Name: 'LineItem2'}, {Name:'LineItem3'}], Meta: mockMeta};

            orderDetailsCtrl = $controller('OrderDetailsCtrl', {
                SelectedOrder: {ID: 'Order123', Name:'mockSelectedOrder'},
                OrderLineItems: {Meta: {Page: 1, PageSize: 12}, Items: [{Name: 'LineItem1'}] }
            });

            var defer = q.defer();
            defer.resolve(mockResponse);
            spyOn(oc.LineItems, 'List').and.returnValue(defer.promise);
        }));

        describe('vm.pageChanged', function(){
            it('should update results with page from vm.lineItems.Meta.Page', function(){
                var mockPage = 1,
                    mockPageSize = 12,
                    direction = 'outgoing',
                    orderID;
                mock.Parameters = {
                    page: mockPage,
                    pageSize: mockPageSize
                };
                orderDetailsCtrl.pageChanged();
                expect(oc.LineItems.List).toHaveBeenCalledWith(direction, orderID, mock.Parameters);
                scope.$digest();
                expect(orderDetailsCtrl.lineItems).toEqual(mockResponse);
            });
        });

        describe('vm.loadMore', function(){
            it('should concatenate next page of results with current list items', function(){
                var mockPage = 1,
                    mockPageSize = 12,
                    direction = 'outgoing',
                    orderID;
                mock.Parameters = {
                    page: mockPage,
                    pageSize: mockPageSize
                };
                orderDetailsCtrl.loadMore();
                expect(oc.LineItems.List).toHaveBeenCalledWith(direction, orderID, mock.Parameters);
                scope.$digest();
                expect(orderDetailsCtrl.lineItems.Meta.Page).toBe(2);
                expect(orderDetailsCtrl.lineItems.Items).toEqual([{Name:'LineItem1'}, {Name: 'LineItem2'}, {Name:'LineItem3'}]);
            });
        });
    });

    describe('Service: ocOrderDetails', function() {
        describe('Method: Get', function() {
            var direction = 'outgoing',
                orderID;
            it('should get a specific order', function() {
                var orderData = {FromCompanyID: 'mockBuyerID'};
                var defer = q.defer();
                defer.resolve(orderData);
                spyOn(oc.Orders, 'Get').and.returnValue(defer.promise);
                spyOn(oc.Buyers, 'Get');
                _ocOrderDetails.Get();
                expect(oc.Orders.Get).toHaveBeenCalledWith(direction, orderID);
                scope.$digest();
                expect(oc.Buyers.Get).toHaveBeenCalledWith(orderData.FromCompanyID);
            })
        })
    })
});