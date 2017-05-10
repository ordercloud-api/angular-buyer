describe('Component: orders', function() {
    var _ocOrders,
        mockParams;
    beforeEach(inject(function(ocOrders) {
        _ocOrders = ocOrders;
    }));

    describe('State: orders', function() {
        var ordersState;
        var parameters;
        var currentUser;
        beforeEach(inject(function(CurrentUser) {
            ordersState = state.get('orders');
            parameters = Parameters;
            currentUser = CurrentUser;
            spyOn(ocParametersService, 'Get');
            spyOn(_ocOrders, 'List');
        }));
        it('should resolve Parameters', function(){
            injector.invoke(ordersState.resolve.Parameters);
            expect(ocParametersService.Get).toHaveBeenCalled();
        });
        it('should resolve OrderList', function() {
            injector.invoke(ordersState.resolve.OrderList);
            expect(_ocOrders.List).toHaveBeenCalledWith(parameters, currentUser);
        });
    });

    describe('Controller: OrdersCtrl', function(){
        var ordersCtrl,
            ocMedia;
        beforeEach(inject(function($controller, $ocMedia){
            ocMedia = $ocMedia;
            ordersCtrl = $controller('OrdersCtrl', {
                $ocMedia: ocMedia,
                OrderList: []
            });
            mockParams = {
                search: null,
                sortBy: ''
            };
            spyOn(ocParametersService, 'Create');
            spyOn(ordersCtrl, 'filter');
            spyOn(state, 'go');
            ordersCtrl.OrderList = {Items: 'Item1', Meta: {Page: 1, PageSize: 12}};
        }));

        describe('vm.selectTab', function(){
            it('set tab and then call vm.filter to reload state', function(){
                var mockTab = 'favorites';
                mockParams.tab = mockTab;
                ordersCtrl.selectTab(mockTab);
                expect(mockParams.tab).toBe(mockTab);
                expect(ordersCtrl.filter).toHaveBeenCalledWith(true);
            });
        });

        describe('vm.search', function(){
            it('should call vm.filter to reload state', function(){
                ordersCtrl.search();
                expect(ordersCtrl.filter).toHaveBeenCalledWith(true);
            });
        });
        describe('vm.clearSearch', function(){
            it('should clear search parameters and then reload state', function(){
                ordersCtrl.clearSearch();
                expect(mockParams.search).toBeNull();
                expect(ordersCtrl.filter).toHaveBeenCalledWith(true);
            });
        });
        describe('vm.reverseSort', function(){
            it('should reload state with a reverse sort call', function(){
                mock.Parameters.sortBy = '!ID';
                ordersCtrl.reverseSort();
                expect(ocParametersService.Create).toHaveBeenCalledWith(mock.Parameters, false);
            });
        });
        describe('vm.pageChanged', function(){
            it('should reload state with the new page', function(){
                mock.Parameters.page = 'newPage';
                ordersCtrl.pageChanged('newPage');
                expect(state.go).toHaveBeenCalled();
                expect(ocParametersService.Create).toHaveBeenCalledWith(mock.Parameters, false);
            });
        });
        describe('vm.loadMore', function(){
            var mockMeta;
            beforeEach(function(){
                mockMeta = {Page: 2, PageSize: 15};
                ordersCtrl.OrderList.Items = [{Name: 'FirstOrder'}, {Name:'SecondOrder'}];
                var mockResponse = {Items: [{Name:'ThirdOrder'}], Meta: mockMeta};

                var defer = q.defer();
                defer.resolve(mockResponse);

                spyOn(_ocOrders, 'List').and.returnValue(defer.promise);
                ordersCtrl.loadMore();
            });
            it('should concatenate next page of results with current list items', function(){
                expect(_ocOrders.List).toHaveBeenCalledWith(mockParams);
                scope.$digest();
                //use toEqual for comparing objects (does deep equality check)
                expect(ordersCtrl.OrderList.Items).toEqual([{Name: 'FirstOrder'}, {Name:'SecondOrder'}, {Name:'ThirdOrder'}]);
                expect(ordersCtrl.OrderList.Meta).toEqual(mockMeta);
            });
        });
    });

    describe('Service: ocOrders', function() {
        beforeEach(inject(function(){
            var defer = q.defer();
            defer.resolve();
            spyOn(_ocOrders, 'List').and.returnValue(defer.promise);
            spyOn(oc.Me, 'ListIncomingOrders').and.returnValue(defer.promise);
            spyOn(oc.Me, 'ListOutgoingOrders').and.returnValue(defer.promise);
        }));


        it('should define methods', function(){
            expect(_ocOrders.List).toBeDefined();
            expect(_ocOrders.List).toEqual(jasmine.any(Function));
        });

        //TODO: Finish Unit tests: unit testing services didn't work like I thought it would
        // it('should default to excluding unsubmitted orders if no status provided', function() {
        //     _ocOrders.List(mockParams, currentUser);
        //     scope.$digest();
        //     expect(oc.Me.ListOutgoingOrders).toHaveBeenCalled();
        //     // expect(orderCloud.Me.ListIncomingOrders).toHaveBeenCalled();
        // });
    });
});

