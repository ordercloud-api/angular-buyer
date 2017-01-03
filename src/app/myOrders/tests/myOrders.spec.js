describe('Component: MyOrders', function() {
    var scope,
        q,
        oc,
        ocParameters,
        mockParams,
        state
        ;
    beforeEach(module(function($provide) {
        mockParams = {search:null, page: null, pageSize: null, searchOn: null, sortBy: null, filters: null, from: null, to: null};
        $provide.value('Parameters', mockParams);
    }));
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope, OrderCloud, OrderCloudParameters, $state) {
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloud;
        ocParameters = OrderCloudParameters;
        state = $state;
    }));

    describe('State: myOrders', function() {
        var state;
        beforeEach(inject(function($state) {
            state = $state.get('myOrders');
            spyOn(ocParameters, 'Get');
            spyOn(oc.Me, 'ListOutgoingOrders');
        }));
        it('should resolve Parameters', inject(function($injector){
            $injector.invoke(state.resolve.Parameters);
            expect(ocParameters.Get).toHaveBeenCalled();
        }));
        it('should resolve OrderList', inject(function($injector) {
            mockParams.filters = {Status:'!Unsubmitted'};
            mockParams.pageSize = 12;
            $injector.invoke(state.resolve.OrderList);
            expect(oc.Me.ListOutgoingOrders).toHaveBeenCalledWith(null, null, 12, null, null, {Status:'!Unsubmitted'}, null, null);
        }));
    });
    describe('State: myOrders.detail', function() {
        var state,
            stateParams,
            mockPaymentList
        ;
        beforeEach(inject(function($state, $stateParams) {
            stateParams = $stateParams;
            state = $state.get('myOrders.detail');

            mockPaymentList = {
                Items: [{
                    Type:'CreditCard',
                    CreditCardID:'CreditCardID123'
                }]
            };
            var defer = q.defer();
            defer.resolve(mockPaymentList);

            spyOn(oc.Me, 'GetOrder');
            spyOn(oc.Payments, 'List').and.returnValue(defer.promise);
            spyOn(oc.Me, 'GetCreditCard');
            spyOn(oc.LineItems, 'List');
            spyOn(oc.Orders, 'ListPromotions');
        }));
        it('should resolve SelectedOrder', inject(function($injector) {
            $injector.invoke(state.resolve.SelectedOrder);
            expect(oc.Me.GetOrder).toHaveBeenCalledWith(stateParams.orderid);
        }));
        it('should resolve Payments', inject(function($injector){
            $injector.invoke(state.resolve.SelectedPayments);
            expect(oc.Payments.List).toHaveBeenCalledWith(stateParams.orderid, null, 1, 100);
            scope.$digest();
            expect(oc.Me.GetCreditCard).toHaveBeenCalledWith(mockPaymentList.Items[0].CreditCardID);
        }));
        it('should resolve LineItemList', inject(function($injector) {
            $injector.invoke(state.resolve.LineItemList);
            expect(oc.LineItems.List).toHaveBeenCalledWith(stateParams.orderid, null, 1, 100);
        }));
        it('should resolve PromotionList', inject(function($injector){
            $injector.invoke(state.resolve.PromotionList);
            expect(oc.Orders.ListPromotions).toHaveBeenCalledWith(stateParams.orderid);
        }));
    });
    describe('Controller: MyOrdersCtrl', function(){
        var myOrdersCtrl,
        ocMedia
        ;
        beforeEach(inject(function($controller, $ocMedia, Parameters){
            ocMedia = $ocMedia;
            myOrdersCtrl = $controller('MyOrdersCtrl', {
                $state: state,
                $ocMedia: ocMedia,
                OrderCloud: oc,
                OrderCloudParameters: ocParameters,
                OrderList: [],
                Parameters: Parameters
            });
            spyOn(ocParameters, 'Create');
            spyOn(state, 'go');
        }));
        describe('search', function(){
            beforeEach(function(){
                mockParams.search = 'Product1';
                myOrdersCtrl.search();
            });
            it('should reload state with search parameters: vm.parameters.search', function(){
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith(mockParams, true);
            });
        });
        describe('clearSearch', function(){
            beforeEach(function(){
                mockParams.search = 'Product1';
                myOrdersCtrl.clearSearch();
            });
            it('should reload state with search parameters cleared', function(){
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith(mockParams, true);
            });
        });
        describe('clearFilters', function(){
            var clearedParams;
            beforeEach(function(){
                clearedParams = angular.copy(mockParams);
                mockParams.filters = {ID:'mockID123'};
                mockParams.from = '12/01/2016';
                mockParams.to = '12/12/2016';
                myOrdersCtrl.clearFilters();
            });
            it('should reload state with the following parameters cleared: filter, from, and to', function(){
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith(clearedParams, true);
            });
        });
        describe('reverseSort', function(){
            var expectedParams;
            beforeEach(function(){
                expectedParams = angular.copy(mockParams);
            });
            it('if param.sortBy is !something it should reload state with param.sortBy equal to something', function(){
                mockParams.sortBy = '!Something';
                expectedParams.sortBy = 'Something';
                myOrdersCtrl.reverseSort();
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith(expectedParams, false);
            }),
            it('if param.sortBy is something it should reload state with param.sortBy equal to !something', function(){
                mockParams.sortBy = 'Something';
                expectedParams.sortBy = '!Something';
                myOrdersCtrl.reverseSort();
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith(expectedParams, false);
            });
        });
        describe('pageChanged', function(){
            it('should reload state with selected page', function(){
                var mockPage = '3';
                myOrdersCtrl.pageChanged(mockPage);
                expect(state.go).toHaveBeenCalledWith('.', {page: mockPage});
            });
        });
        describe('loadMore', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(oc.Me, 'ListIncomingOrders').and.returnValue(defer.promise);
                myOrdersCtrl.list = {
                    Meta: {
                        Page: 1,
                        PageSize: 12
                    }
                };
                myOrdersCtrl.loadMore();
            });
            it('should load the next page of results', function(){
                expect(oc.Me.ListIncomingOrders).toHaveBeenCalledWith(null, null, null, 2, 12, null, null, null);
            });
        });
    });
    describe('Controller: MyOrderDetailCtrl', function() {
        var orderDetailCtrl,
            ocConfirm,
            toaster,
            mockOrderID
        ;
        beforeEach(inject(function($controller, toastr, OrderCloudConfirm) {
            toaster = toastr;
            ocConfirm = OrderCloudConfirm;
            mockOrderID = 'Order123';
            orderDetailCtrl = $controller('MyOrderDetailCtrl', {
                $scope: scope,
                $state: state,
                toaster: toastr,
                OrderCloud: oc,
                OrderCloudConfirm: ocConfirm,
                SelectedOrder: [],
                SelectedPayments: [],
                LineItemList: [],
                PromotionList:[]
            });
            spyOn(state, 'go');
        }));

        describe('cancelOrder', function() {
            beforeEach(function() {
                var defer = q.defer();
                defer.resolve();
                spyOn(ocConfirm, 'Confirm').and.returnValue(defer.promise);
                spyOn(oc.Orders, 'Cancel').and.returnValue(defer.promise);
                spyOn(toaster, 'success');
                orderDetailCtrl.cancelOrder(mockOrderID);
            });
            it('should call OrderCloud Confirm', function() {
                expect(ocConfirm.Confirm).toHaveBeenCalledWith('Are you sure you want to cancel this order?');
            });
            it('should call Orders.Cancel', function(){
                scope.$digest();
               expect(oc.Orders.Cancel).toHaveBeenCalledWith(mockOrderID);
            });
            it('should call state.go and take user to myOrders state', function(){
                scope.$digest();
                expect(state.go).toHaveBeenCalledWith('myOrders', {}, {reload: true});
                expect(toaster.success).toHaveBeenCalledWith('Order Cancelled', 'Success');
            });
        });
    });
});

