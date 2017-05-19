describe('Directive: Featured Products', function() {

    var _ocFeaturedProducts;

    beforeEach(inject(function(ocFeaturedProductsService) {
        _ocFeaturedProducts = ocFeaturedProductsService;
    }));

    describe('Factory: ocFeaturedProducts', function() {
        describe('List', function() {
            beforeEach(function() {
                mock.Product.xp = {Featured: true};
                spyOn(oc.Me, 'ListProducts').and.returnValue(dummyPromise);
                _ocFeaturedProducts.List();
            });
            it('should call oc.Me.ListProducts with filters xp.Featured: true', function() {
                var parameters = {
                    filters: {
                        'xp.Featured': true
                    }
                };
                expect(oc.Me.ListProducts).toHaveBeenCalledWith(parameters);
            })
        });
    });
});