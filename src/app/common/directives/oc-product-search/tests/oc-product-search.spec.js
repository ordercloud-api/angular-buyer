describe('Directive: ocProductSearch', function(){
    var productSearchComponentCtrl;
    beforeEach(inject(function($controller){
        productSearchComponentCtrl = $controller('ProductSearchComponentCtrl');
        productSearchComponentCtrl.searchTerm = 'SEARCH';
        productSearchComponentCtrl.catalogid = mock.Buyer.DefaultCatalogID;
        productSearchComponentCtrl.maxProducts = 5;
        spyOn(state, 'go').and.returnValue(dummyPromise);
    }));
    describe('getSearchResults', function(){
        beforeEach(function(){
            spyOn(oc.Me, 'ListProducts').and.returnValue(dummyPromise);
        });
        it('should call Me.ListProducts with given search term and max products', function(){
            mock.Parameters = {
                catalogID: mock.Buyer.DefaultCatalogID,
                search: productSearchComponentCtrl.searchTerm,
                page: 1,
                pageSize: 5,
                depth: 'all'
            };
            productSearchComponentCtrl.getSearchResults();
            expect(oc.Me.ListProducts).toHaveBeenCalledWith(mock.Parameters);
        });
        it('should default max products to five, if none is provided', function(){
            mock.Parameters = {
                catalogID: mock.Buyer.DefaultCatalogID,
                search: productSearchComponentCtrl.searchTerm,
                page: 1,
                pageSize: 5,
                depth: 'all'
            };
            productSearchComponentCtrl.getSearchResults();
            expect(oc.Me.ListProducts).toHaveBeenCalledWith(mock.Parameters);
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
            expect(state.go).toHaveBeenCalledWith('productBrowse.products', {catalogid: mock.Buyer.DefaultCatalogID, search: 'bikes', categoryid: ''});
        });
    });
});