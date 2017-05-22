describe('Directive: Related Products', function() {
    var _ocRelatedProducts;

    beforeEach(inject(function(ocRelatedProducts) {
        _ocRelatedProducts = ocRelatedProducts;
    }));

    describe('Factory: ocRelatedProducts', function() {

        describe('List', function() {
            beforeEach(function() {
                mock.Product.xp = {RelatedProducts: ['ID1', 'ID1']};
                var defer = q.defer();
                defer.resolve(mock.Product.xp.RelatedProducts);
                spyOn(oc.Me, 'ListProducts').and.returnValue(defer.promise);
                _ocRelatedProducts.List(mock.Product.xp.RelatedProducts);
            });
            it('should list all products in the array of RelatedProducts on the mock product', function() {
                var parameters = {
                    filters: {
                        ID: mock.Product.xp.RelatedProducts.join('|')
                    }
                };
                expect(oc.Me.ListProducts).toHaveBeenCalledWith(parameters);
            });
        });
    });
});