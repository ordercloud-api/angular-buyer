fdescribe('Component: addPromotion', function(){
    var ctrl,
    componentScope
    ;
    beforeEach(inject(function($componentController, $rootScope, $compile){
        scope = $rootScope.$new();
        scope.product = mock.Product;
        scope.currentOrder = mock.Order;
        scope.lineitemlist = {Items: mock.LineItem};
        var element = $compile('<oc-favorite-product ></oc-favorite-product>')(scope);
        scope.$digest();
        componentScope = element.scope();
        ctrl = $componentController('ocProductCard', {$scope: componentScope});
    }));
    describe('$onInit', function(){
        var newQty = 2;
        var oldQty = 10;
        beforeEach(function(){
            spyOn(ctrl, 'setDefaultQuantity');
            spyOn(ctrl, 'findPrice');
            ctrl.product = {};
            ctrl.currentOrder = mock.Order;
            componentScope.vm = ctrl;
        });
        it('should call setDefaultQuantity', function(){
            ctrl.$onInit();
            ctrl.product.Quantity = newQty;
            componentScope.$apply();
            expect(ctrl.findPrice).not.toHaveBeenCalled();
            expect(ctrl.setDefaultQuantity).toHaveBeenCalled();
            
        });
        it('should only init default quantities when there is a current order', function(){
            delete ctrl.currentOrder;
            ctrl.$onInit();
            expect(ctrl.setDefaultQuantity).not.toHaveBeenCalled();
            expect(ctrl)
        });
        it('should create a watch if price breaks are defined', function(){
            ctrl.product = {PriceSchedule: {PriceBreaks: {Quantity: oldQty, Price: 3}}};
            ctrl.$onInit();
            ctrl.product.Quantity = newQty;
            componentScope.$apply();
            expect(ctrl.findPrice).toHaveBeenCalledWith(newQty);
        })
        it('should not create a watch if price breaks are not defined', function(){
            ctrl.$onInit();
            ctrl.product.Quantity = newQty;
            componentScope.$apply();
            expect(ctrl.findPrice).not.toHaveBeenCalled();
        });
    });

    describe('addToCart', function(){
        var mockLI = {ProductID: mock.LineItem.ID, Quantity: mock.LineItem.Quantity};
        beforeEach(function(){
            spyOn(oc.LineItems, 'Create').and.returnValue(dummyPromise);
            spyOn(ctrl, 'setDefaultQuantity');
            spyOn(componentScope, '$emit').and.callThrough();
            ctrl.currentOrder = mock.Order;
            ctrl.product = mock.LineItem;
        });
        it('should call LineItems.Create', function(){
            ctrl.addToCart();
            expect(oc.LineItems.Create).toHaveBeenCalledWith('outgoing', mock.Order.ID, mockLI);
        });
        it('should emit OC:UpdateOrder event', function(){
            ctrl.addToCart();
            componentScope.$digest();
            expect(componentScope.$emit).toHaveBeenCalledWith('OC:UpdateOrder', mock.Order.ID, {lineItems: mockLI, add: true})
        });
        it('should call setDefaultQuantity', function(){
            ctrl.addToCart();
            componentScope.$digest();
            expect(ctrl.setDefaultQuantity).toHaveBeenCalled();
        });
    });

    describe('findPrice', function(){
        beforeEach(function(){
            ctrl.calculatedPrice = null;
            ctrl.product = {PriceSchedule: {PriceBreaks: [{Quantity: 1, Price: 5}, {Quantity: 2, Price: 3}]}};
        });
        it('should not call function if there is no qty parameter', function(){
            ctrl.findPrice();
            componentScope.$digest();
            expect(ctrl.calculatedPrice).toBe(null);
        });
        it('given quantity 1 should give price 5', function(){
            ctrl.findPrice(1);
            componentScope.$digest();
            expect(ctrl.calculatedPrice).toBe(5);
        });
        it('given quantity 5 should give price 15', function(){
            ctrl.findPrice(5);
            componentScope.$digest();
            expect(ctrl.calculatedPrice).toBe(15);
        });
    });

    describe('setDefaultQuantity', function(){
        var minQty;
        beforeEach(function(){
            minQty = 2;
            ctrl.product = {};
        })
        it('should set quantity to 1 if no MinQuantity exists on price schedule', function(){
            ctrl.setDefaultQuantity();
            expect(ctrl.product.Quantity).toBe(1);
        })
        it('should set quantity to MinQuantity if it exists on price schedule', function(){
            ctrl.product = {PriceSchedule: {MinQuantity: minQty}};
            ctrl.setDefaultQuantity();
            expect(ctrl.product.Quantity).toBe(minQty);
        })
    });
});