describe('Component: ProductDetail', function() {
    var _lineItemHelpers;

    beforeEach(inject(function(ocLineItems) {
        _lineItemHelpers = ocLineItems;
    }));

    describe('State: Product',function() {
        var productDetailState;
        beforeEach(inject(function($stateParams){
            productDetailState = state.get('productDetail');
            mock.Product.ID = $stateParams.productid;
            spyOn(oc.Me,'GetProduct');
        }));

        it('should resolve Product', function(){
            injector.invoke(productDetailState.resolve.Product);
            expect(oc.Me.GetProduct).toHaveBeenCalledWith(mock.Product.ID);
        });
    });

    describe('Controller: ProductDetail', function(){
        var productDetailCtrl;
        beforeEach(inject(function($controller){
            productDetailCtrl = $controller('ProductDetailCtrl',{
                Product : mock.Product
            });

        }));

        describe('vm.addToCart', function(){
            beforeEach( function(){
                spyOn(_lineItemHelpers,'AddItem').and.returnValue(dummyPromise);
                spyOn(toastrService, 'success');
                productDetailCtrl.addToCart();
            });
           it('should  call the ocLineItems AddItem method and display toastr', function(){
             expect(_lineItemHelpers.AddItem).toHaveBeenCalledWith(mock.Order, productDetailCtrl.item);
           });
            it('should call toastr when successful', function(){
                scope.$digest();
                expect(toastrService.success).toHaveBeenCalled();
            });
        });

        describe('vm.findPrice', function(){
            it("finalPriceBreak should equal price of Pricebreak ", function(){
                var possibleQuantities= [2];
                for(var i = 0; i <possibleQuantities.length; i++){
                    productDetailCtrl.findPrice(possibleQuantities[i]);
                    expect(productDetailCtrl.finalPriceBreak.Price).toBe(productDetailCtrl.item.PriceSchedule.PriceBreaks[i].Price);
                }

            })
        })
    });
});
