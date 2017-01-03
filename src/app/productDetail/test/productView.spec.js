describe('Component: ProductDetail', function(){
    var scope,
        oc,
        mockProduct,
        productResolve,
        lineItemHelpers,
        currentOrder
    ;
//if the service your are calling in is a higher order resolve you have to mock instead of inject
// / when you are calling a service that returns a function. Mock the promise!
    // when defining a controller, Key: Actual Service Value Mocked variable

    beforeEach(module('orderCloud'));
    beforeEach(module(function($provide) {
        $provide.value('CurrentOrder', {ID: "MockOrderID3456"})
    }));
    beforeEach(inject(function($rootScope, OrderCloud, LineItemHelpers, CurrentOrder){
        scope = $rootScope.$new();
        oc = OrderCloud;
        mockProduct = {
            "ID": "MockProductID123",
            "Name": "MockProductName",
            "Description": "mockDescription",
            "StandardPriceSchedule": {
                "PriceBreaks" : [
                    {
                        "Quantity": 2,
                        "Price" : 10
                    }
                ]

            }
        };
        lineItemHelpers = LineItemHelpers;
        currentOrder = CurrentOrder;

    }));

    describe('Configuration: ProductViewConfig', function(){
        var state,
            stateParams;

        describe('State: Product',function(){
            beforeEach(inject(function($stateParams, $state){
                state = $state.get('productDetail');
                stateParams = $stateParams;
                stateParams.productid = "MockProductID123";
                spyOn(oc.Me,'GetProduct');
            }));

            it('should resolve Product', inject(function($injector){
                $injector.invoke(state.resolve.Product);
                expect(oc.Me.GetProduct).toHaveBeenCalledWith("MockProductID123");
            }));
        });
    });

    describe('Controller: ProductDetail', function(){
        var productDetailCtrl;
        var toaster;
        var q;
        beforeEach(inject(function($controller, toastr, $q){
            toaster= toastr;
            q = $q;

            productDetailCtrl = $controller('ProductDetailCtrl',{
                Product : mockProduct,
                CurrentOrder: currentOrder,
                LineItemHelpers: lineItemHelpers,
                toastr : toaster
            });

        }));

        describe('addToCart', function(){
            beforeEach( function(){
                var defer =  q.defer();
                defer.resolve();
                spyOn(lineItemHelpers,'AddItem').and.returnValue(defer.promise);
                spyOn(toaster, 'success');
                productDetailCtrl.addToCart();
            });
           it('should  call the LineItemHelpers AddItem method and display toastr', function(){
             expect(lineItemHelpers.AddItem).toHaveBeenCalledWith(currentOrder, mockProduct);
           });
            it('should call toastr when successful', function(){
                scope.$digest();
                expect(toaster.success).toHaveBeenCalled();
            });
        });

        describe('findPrice function', function(){
            //set up like this for potential  addition of different quantities.
            it("finalPriceBreak should equal price of Pricebreak ", function(){
                var possibleQuantities= [2];
                for(var i = 0; i <possibleQuantities.length; i++){
                    productDetailCtrl.findPrice(possibleQuantities[i]);
                    expect(productDetailCtrl.finalPriceBreak.Price).toBe( mockProduct.StandardPriceSchedule.PriceBreaks[i].Price );
                }

            })
        })
    });
});
