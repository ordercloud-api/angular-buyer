describe('Component: orders', function() {
    var scope,
        q,
        oc,
        _ocParameters,
        _ocOrders,
        mockParams,
        currentUser,
        state
        ;
    beforeEach(module(function($provide) {
        mockParams = {search:null, page: null, pageSize: null, searchOn: null, sortBy: null, filters: null, from: null, to: null, favorites: null};
        currentUser = {Name: 'mockUserName', ID: 'mockUser123'};
        $provide.value('Parameters', mockParams);
        $provide.value('CurrentUser', currentUser);
    }));
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope, OrderCloud, ocParameters, ocOrders, CurrentUser, $state) {
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloud;
        _ocParameters = ocParameters;
        _ocOrders = ocOrders;
        state = $state;
    }));



    describe('State: orders', function() {
        var state;
        var parameters;
        var currentUser;
        beforeEach(inject(function($state, Parameters, CurrentUser) {
            state = $state.get('orders');
            parameters = Parameters;
            currentUser = CurrentUser;
            spyOn(_ocParameters, 'Get');
            spyOn(_ocOrders, 'List');
        }));
        it('should resolve Parameters', inject(function($injector){
            $injector.invoke(state.resolve.Parameters);
            expect(_ocParameters.Get).toHaveBeenCalled();
        }));
        it('should resolve OrderList', inject(function($injector) {
            $injector.invoke(state.resolve.OrderList);
            expect(_ocOrders.List).toHaveBeenCalledWith(parameters, currentUser);
        }));
    });



    describe('Controller: OrdersCtrl', function(){
        var ordersCtrl,
        ocMedia
        ;
        beforeEach(inject(function($controller, $ocMedia, Parameters){
            ocMedia = $ocMedia;
            ordersCtrl = $controller('OrdersCtrl', {
                $state: state,
                $ocMedia: ocMedia,
                OrderCloud: oc,
                ocParameters: _ocParameters,
                OrderList: [],
                Parameters: Parameters
            });
            spyOn(_ocParameters, 'Create');
            spyOn(state, 'go');
            spyOn(ordersCtrl, 'filter');
            ordersCtrl.list = {Items: 'Item1', Meta: {Page: 1, PageSize: 12}};
        }));


        describe('selectTab', function(){
            it('set tab and then call vm.filter to reload state', function(){
                var mockTab = 'favorites';
                ordersCtrl.selectTab(mockTab);
                expect(mockParams.tab).toBe(mockTab);
                expect(ordersCtrl.filter).toHaveBeenCalledWith(true);
            });
        });


        describe('search', function(){
            it('should call vm.filter to reload state', function(){
                ordersCtrl.search();
                expect(ordersCtrl.filter).toHaveBeenCalledWith(true);
            });
        });


        describe('clearSearch', function(){
            it('should clear search parameters and then reload state', function(){
                ordersCtrl.clearSearch();
                expect(mockParams.search).toBeNull();
                expect(ordersCtrl.filter).toHaveBeenCalledWith(true);
            });
        });
        

        describe('reverseSort', function(){
            it('if param.sortBy is !something it should reload state with param.sortBy equal to something', function(){
                mockParams.sortBy = '!Something';
                ordersCtrl.reverseSort();

                expect(mockParams.sortBy).toBe('Something');
                expect(ordersCtrl.filter).toHaveBeenCalledWith(false);
            }),
            it('if param.sortBy is something it should reload state with param.sortBy equal to !something', function(){
                mockParams.sortBy = 'Something';
                ordersCtrl.reverseSort();

                expect(mockParams.sortBy).toBe('!Something');
                expect(ordersCtrl.filter).toHaveBeenCalledWith(false);
            });
        });


        describe('pageChanged', function(){
            it('should reload state with page from vm.list.Meta.Page', function(){
                var mockPage = 3;
                ordersCtrl.list.Meta.Page = 3;

                ordersCtrl.pageChanged();
                expect(state.go).toHaveBeenCalledWith('.', {page: mockPage});
            });
        });


        describe('loadMore', function(){
            var mockMeta;
            beforeEach(function(){
                mockMeta = {Page: 2, PageSize: 15};
                ordersCtrl.list.Items = [{Name: 'FirstOrder'}, {Name:'SecondOrder'}];
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
                expect(ordersCtrl.list.Items).toEqual([{Name: 'FirstOrder'}, {Name:'SecondOrder'}, {Name:'ThirdOrder'}]);
                expect(ordersCtrl.list.Meta).toEqual(mockMeta);
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

