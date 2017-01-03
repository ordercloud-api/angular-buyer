describe('Component: Product Search', function(){
    var scope,
        q,
        oc,
        state,
        ocParameters,
        parameters,
        mockProductList
        ;
    beforeEach(module(function($provide) {
        $provide.value('Parameters', {searchTerm: null, page: null,  pageSize: null, sortBy: null});
    }));
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope, $q, OrderCloud, OrderCloudParameters, $state, Parameters){
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloud;
        state = $state;
        ocParameters = OrderCloudParameters;
        parameters = Parameters;
        mockProductList = {
            Items:['product1', 'product2'],
            Meta:{
                ItemRange:[1, 3],
                TotalCount: 50
            }
        };
    }));
    describe('State: productSearchResults', function(){
        var state;
        beforeEach(inject(function($state){
            state = $state.get('productSearchResults');
            spyOn(ocParameters, 'Get');
            spyOn(oc.Me, 'ListProducts');
        }));
        it('should resolve Parameters', inject(function($injector){
            $injector.invoke(state.resolve.Parameters);
            expect(ocParameters.Get).toHaveBeenCalled();
        }));
        it('should resolve ProductList', inject(function($injector){
            parameters.filters = {ParentID:'12'};
            $injector.invoke(state.resolve.ProductList);
            expect(oc.Me.ListProducts).toHaveBeenCalled();
        }));
    });
    describe('Controller: ProductSearchController', function(){
        var productSearchCtrl;
        beforeEach(inject(function($state, $controller){
            var state = $state;
            productSearchCtrl = $controller('ProductSearchCtrl', {
                $state: state,
                OrderCloudParameters: ocParameters,
                $scope: scope,
                ProductList: mockProductList
            });
            spyOn(ocParameters, 'Create');
            spyOn(state, 'go');
        }));
        describe('filter', function(){
            it('should reload state and call OrderCloudParameters.Create with any parameters', function(){
                productSearchCtrl.parameters = {pageSize: 1};
                productSearchCtrl.filter(true);
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith({pageSize:1}, true);
            });
        });
        describe('updateSort', function(){
            it('should reload page with value and sort order, if both are defined', function(){
                productSearchCtrl.updateSort('ID', '!');
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith({searchTerm: null, page: null,  pageSize: null, sortBy: '!ID'}, false);
            });
            it('should reload page with just value, if no order is defined', function(){
                productSearchCtrl.updateSort('ID');
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith({searchTerm: null, page: null,  pageSize: null, sortBy: 'ID'}, false);
            });
        });
        describe('updatePageSize', function(){
            it('should reload state with the new pageSize', function(){
                productSearchCtrl.updatePageSize('25');
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith({searchTerm: null, page: null,  pageSize: '25', sortBy: null}, true);
            });
        });
        describe('pageChanged', function(){
            it('should reload state with the new page', function(){
                productSearchCtrl.pageChanged('newPage');
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith({searchTerm: null, page: 'newPage',  pageSize: null, sortBy: null}, false);
            });
        });
        describe('reverseSort', function(){
            it('should reload state with a reverse sort call', function(){
                productSearchCtrl.parameters.sortBy = 'ID';
                productSearchCtrl.reverseSort();
                expect(ocParameters.Create).toHaveBeenCalledWith({searchTerm: null, page: null,  pageSize: null, sortBy: '!ID'}, false);
            });
        });
    });
    describe('Component Directive: ordercloudProductSearch', function(){
        var productSearchComponentCtrl,
        timeout
        ;
        beforeEach(inject(function($componentController, $timeout){
            timeout = $timeout;
            productSearchComponentCtrl = $componentController('ordercloudProductSearch', {
                $state:state,
                $timeout: timeout,
                $scope: scope,
                OrderCloud:oc
            });
            spyOn(state, 'go');
        }));
        describe('getSearchResults', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(oc.Me, 'ListProducts').and.returnValue(defer.promise);
            });
            it('should call Me.ListProducts with given search term and max products', function(){
                productSearchComponentCtrl.searchTerm = 'Product1';
                productSearchComponentCtrl.maxProducts = 12;
                productSearchComponentCtrl.getSearchResults();
                expect(oc.Me.ListProducts).toHaveBeenCalledWith('Product1', 1, 12);
            });
            it('should default max products to five, if none is provided', function(){
                productSearchComponentCtrl.searchTerm = 'Product1';
                productSearchComponentCtrl.getSearchResults();
                expect(oc.Me.ListProducts).toHaveBeenCalledWith('Product1', 1, 5);
            });
        });
        describe('onSelect', function(){
            it('should route user to productDetail state for the selected product id', function(){
                productSearchComponentCtrl.onSelect(12);
                expect(state.go).toHaveBeenCalledWith('productDetail', {productid:12});
            });
        });
        describe('onHardEnter', function(){
            it('should route user to search results page for the provided search term', function(){
                productSearchComponentCtrl.onHardEnter('bikes');
                expect(state.go).toHaveBeenCalledWith('productSearchResults', {searchTerm: 'bikes'});
            });
        });
    });
});