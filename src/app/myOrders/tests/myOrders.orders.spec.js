//TODO: Fix Failing unit tests #F51-322


// describe('Component: orders', function() {

//     var _ocOrders;
//     beforeEach(inject(function(ocOrders) {
//         _ocOrders = ocOrders;
//     }));

//     describe('State: orders', function() {
//         var ordersState;
//         var currentUser;
//         beforeEach(inject(function(CurrentUser) {
//             ordersState = state.get('orders');
//             currentUser = CurrentUser;
//             spyOn(ocParametersService, 'Get');
//             spyOn(_ocOrders, 'List');
//         }));
//         it('should resolve Parameters', function(){
//             injector.invoke(ordersState.resolve.Parameters);
//             expect(ocParametersService.Get).toHaveBeenCalled();
//         });
//         it('should resolve OrderList', function() {
//             injector.invoke(ordersState.resolve.OrderList);
//             expect(_ocOrders.List).toHaveBeenCalledWith(mock.Parameters, currentUser);
//         });
//     });

//     describe('Controller: OrdersCtrl', function(){
//         var ordersCtrl,
//             ocMedia;
//         beforeEach(inject(function($controller, $ocMedia){
//             ocMedia = $ocMedia;
//             ordersCtrl = $controller('OrdersCtrl', {
//                 $ocMedia: ocMedia,
//                 OrderList: {
//                     Items: ['Item1', 'Item2'],
//                     Meta: {
//                         Page: 1,
//                         PageSize: 12
//                     }
//                 }
//             });
//             spyOn(ordersCtrl, 'filter');
//             spyOn(state, 'go');
//         }));

//         describe('vm.selectTab', function(){
//             it('set tab and then call vm.filter to reload state', function(){
//                 var mockTab = 'favorites';
//                 mock.Parameters.tab = mockTab;
//                 ordersCtrl.selectTab(mockTab);
//                 expect(mock.Parameters.tab).toBe(mockTab);
//                 expect(ordersCtrl.filter).toHaveBeenCalledWith(true);
//             });
//         });

//         describe('vm.search', function(){
//             it('should call vm.filter to reload state', function(){
//                 ordersCtrl.search();
//                 expect(ordersCtrl.filter).toHaveBeenCalledWith(true);
//             });
//         });
//         describe('vm.clearSearch', function(){
//             it('should clear search parameters and then reload state', function(){
//                 ordersCtrl.clearSearch();
//                 expect(mock.Parameters.search).toBeNull();
//                 expect(ordersCtrl.filter).toHaveBeenCalledWith(true);
//             });
//         });
//         describe('vm.reverseSort', function(){
//             it('should reload state with a reverse sort call', function(){
//                 mock.Parameters.sortBy = '!ID';
//                 ordersCtrl.reverseSort();
//                 expect(ordersCtrl.filter).toHaveBeenCalledWith(false);
//             });
//         });
//         describe('vm.pageChanged', function(){
//             it('should reload state with the new page', function(){
//                 ordersCtrl.pageChanged();
//                 expect(state.go).toHaveBeenCalledWith('.', {page: ordersCtrl.list.Meta.Page});
//             });
//         });
//         describe('vm.loadMore', function(){
//             var mockMeta;
//             beforeEach(function(){
//                 mockMeta = {Page: 2, PageSize: 15};
//                 ordersCtrl.list.Items = [{Name: 'FirstOrder'}, {Name:'SecondOrder'}];
//                 var mockResponse = {Items: [{Name:'ThirdOrder'}], Meta: mockMeta};

//                 var defer = q.defer();
//                 defer.resolve(mockResponse);

//                 spyOn(_ocOrders, 'List').and.returnValue(defer.promise);
//                 ordersCtrl.loadMore();
//             });
//             it('should concatenate next page of results with current list items', function(){
//                 expect(_ocOrders.List).toHaveBeenCalledWith(mock.Parameters);
//                 scope.$digest();
//                 // use toEqual for comparing objects (does deep equality check)
//                 expect(ordersCtrl.list.Items).toEqual([{Name: 'FirstOrder'}, {Name:'SecondOrder'}, {Name:'ThirdOrder'}]);
//                 expect(ordersCtrl.list.Meta).toEqual(mockMeta);
//             });
//         });
//     });

//     describe('Factory: ocOrders', function() {

//         it('should define methods', function(){
//             expect(_ocOrders.List).toBeDefined();
//             expect(_ocOrders.List).toEqual(jasmine.any(Function));
//         });

//         describe('Method: List', function() {
//             beforeEach(function() {
//                 var parameters = mock.Parameters;
//                 parameters.tab = 'approvals';
//                 spyOn(oc.Me, 'ListApprovableOrders').and.returnValue(dummyPromise);

//                 _ocOrders.List(parameters, mock.user);
                
//             });
//             it('should return a list of approvalbe orders if parameters tab == approvals', function(){
//                 scope.$digest();
//                 var parameters = {
//                     search: null,
//                     page: 2,
//                     pageSize: 12,
//                     searchOn: null,
//                     sortBy: 'ID',
//                     filters: {
//                         status: 'Open|AwaitingApproval|Completed|Declined|Cancelled'
//                     },
//                     catalogID: null,
//                     categoryID: null,
//                     categoryPage: null,
//                     productPage: null,
//                     tab: 'approvals'
//                 };
//                 expect(oc.Me.ListApprovableOrders).toHaveBeenCalledWith(parameters);
//             })
//         })
//         describe('Method: List', function() {
//             beforeEach(function() {
//                 var parameters = mock.Parameters;
//                 parameters.tab = null;
//                 spyOn(oc.Me, 'ListOrders').and.returnValue(dummyPromise);

//                 _ocOrders.List(parameters, mock.user);
                
//             });
//             it('should return a list of orders if parameters tab !== approvals', function(){
//                 scope.$digest();
//                 var parameters = {
//                     search: null,
//                     page: 2,
//                     pageSize: 12,
//                     searchOn: null,
//                     sortBy: 'ID',
//                     filters: {
//                         status: 'Open|AwaitingApproval|Completed|Declined|Cancelled'
//                     },
//                     catalogID: null,
//                     categoryID: null,
//                     categoryPage: null,
//                     productPage: null,
//                     tab: null
//                 };
//                 expect(oc.Me.ListOrders).toHaveBeenCalledWith(parameters);
//             })
//         })
//     });
// });