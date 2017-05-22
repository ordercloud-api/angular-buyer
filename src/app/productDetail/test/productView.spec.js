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

    describe('Directive: ocSpecForm', function() {
        var element,
            specs;
        beforeEach(function() {
            var defer = q.defer();
            defer.resolve(specs);
            spyOn(oc.Me, 'ListSpecs').and.returnValue(defer.promise);
            //mock.product = {ID: 'MockProductID'};
            scope.mockProduct = mock.Product;
            specs = [
                {
                    "mockSpec": [
                        "mockOption"
                    ]
                }
            ];
            element = compile('<oc-spec-form product="mockProduct"></oc-spec-form>')(scope);
        });
        it('should initialize the isolate scope', function() {
            expect(element.isolateScope().product).toEqual(mock.product);
        })
        it('should call Me.ListSpecs with a product ID and parameters', function() {
            var parameters = {
                page: 1,
                pageSize: 100
            };
            expect(oc.Me.ListSpecs).toHaveBeenCalledWith(mock.Product.ID, parameters);
        })
    })
});
