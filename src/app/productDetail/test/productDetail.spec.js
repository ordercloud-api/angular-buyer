describe('Component: ProductDetail', function () {

    describe('Configuration: ProductViewConfig', function () {
        describe('State: Product', function () {
            var productDetailState,
                _ocProducts;
            beforeEach(inject(function ($stateParams, ocProducts) {
                productDetailState = state.get('productDetail');
                stateParams = $stateParams;
                stateParams.productid = mock.Product.ID;
                _ocProducts = ocProducts;
                spyOn(oc.Me, 'GetProduct');
                spyOn(_ocProducts, 'Related');
            }));
            it('should resolve Product', (function () {
                injector.invoke(productDetailState.resolve.Product);
                expect(oc.Me.GetProduct).toHaveBeenCalledWith(stateParams.productid);
            }));
            it('should return a list of related products from the resolved product', function () {
                injector.invoke(productDetailState.resolve.RelatedProducts);
                expect(_ocProducts.Related).toHaveBeenCalledWith(mock.Product.xp.RelatedProducts);
            });
        });
    });

    describe('Controller: ProductDetail', function () {
        beforeEach(inject(function ($controller) {
            productDetailCtrl = $controller('ProductDetailCtrl', {
                Product: mock.Product,
                CurrentOrder: mock.Order,
                ocLineItems: ocLineItemsService,
                toastr: toastrService,
                RelatedProducts: mock.Product.xp.RelatedProducts
            });
        }));

        describe('addToCart', function () {
            beforeEach(function () {
                spyOn(ocLineItemsService, 'AddItem').and.returnValue(q.when(dummyPromise));
                spyOn(toastrService, 'success');
                productDetailCtrl.addToCart();
            });
            it('should  call the ocLineItems AddItem method and display toastr', function () {
                expect(ocLineItemsService.AddItem).toHaveBeenCalledWith(mock.Order, mock.Product);
            });
            it('should call toastr when successful', function () {
                scope.$digest();
                expect(toastrService.success).toHaveBeenCalled();
            });
        });

        describe('findPrice function', function () {
            //set up like this for potential  addition of different quantities.
            it("finalPriceBreak should equal price of Pricebreak ", function () {
                var possibleQuantities = [2];
                for (var i = 0; i < possibleQuantities.length; i++) {
                    productDetailCtrl.findPrice(possibleQuantities[i]);
                    expect(productDetailCtrl.finalPriceBreak.Price).toBe(mock.Product.PriceSchedule.PriceBreaks[i].Price);
                }

            })
        })
    });
});
