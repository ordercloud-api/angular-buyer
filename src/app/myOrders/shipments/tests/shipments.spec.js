describe('Component: Shipments', function() {

    var _ocOrderShipments;
    beforeEach(inject(function(ocOrderShipments) {
        _ocOrderShipments = ocOrderShipments;
    }));

    describe('State: orderDetail.shipments', function() {
        var orderShipmentsState,
            mockLineItems;
        beforeEach(inject(function($stateParams) {
            orderShipmentsState = state.get('orderDetail.shipments');
            mock.Order.ID = $stateParams.orderid;
            mockLineItems = mock.LineItems;
            spyOn(_ocOrderShipments, 'List');
        }));
        it('should resolve OrderShipments', function() {
            injector.invoke(orderShipmentsState.resolve.OrderShipments);
            expect(_ocOrderShipments.List).toHaveBeenCalledWith(mock.Order.ID, 1, 100, mockLineItems);
        })
    });

    describe('Controller: OrderShipmentsCtrl', function() {
        var orderShipmentsCtrl,
            mockLineItems;
        beforeEach(inject(function($controller) {
            orderShipmentsCtrl = $controller('OrderShipmentsCtrl', {
                shipments: mock.Shipments,
                orderID: mock.Order.ID
            });
            mockLineItems = mock.LineItems;
            spyOn(_ocOrderShipments, 'List').and.returnValue(dummyPromise);
        }));
        describe('vm.pageChanged', function() {
            it('should update the page on Meta', function() {
                var page = 1;
                var pageSize = 100;
                orderShipmentsCtrl.pageChanged();
                expect(_ocOrderShipments.List).toHaveBeenCalledWith(mock.Order.ID, page, pageSize, mockLineItems);
            })
        });
        describe('vm.loadMore', function() {
            it('should increase the pageSize on Meta', function() {
                var page = 2;
                var pageSize = 100;
                orderShipmentsCtrl.loadMore();
                expect(_ocOrderShipments.List).toHaveBeenCalledWith(mock.Order.ID, page, pageSize, mockLineItems);
            })
        });
    });

    describe('Factory: ocOrderShipments', function() {
        var page,
            pageSize,
            orderID;
        it('should define methods', function(){
            expect(_ocOrderShipments.List).toBeDefined();
            expect(_ocOrderShipments.List).toEqual(jasmine.any(Function));
        });
        describe('Method: List', function() {
            beforeEach(function() {
                var defer = q.defer();
                defer.resolve({Items: [{ID: 'testID'}]});
                spyOn(oc.Me, 'ListShipments').and.returnValue(defer.promise);
                spyOn(oc.Me, 'ListShipmentItems');

                _ocOrderShipments.List();
            });
            it('should return a list of shipments from the Me endpoint', function() {
                expect(oc.Me.ListShipments).toHaveBeenCalledWith({orderID: orderID, page: page, pageSize: pageSize})
            })
        })
    })
});