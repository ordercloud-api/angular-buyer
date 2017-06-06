describe('Directive: ocProductCard', function(){
    var ctrl,
    componentScope
    ;
    beforeEach(inject(function($controller, $rootScope, $compile){
        scope = $rootScope.$new();
        scope.product = mock.Product;
        scope.currentOrder = mock.Order;
        var element = $compile('<oc-product-card></oc-product-card>')(scope);
        scope.$digest();
        directiveScope = element.scope();
        ctrl = $controller('ProductCardCtrl', {$scope: directiveScope});
    }));
    describe('$onInit', function(){
        var newQty = 2;
        var oldQty = 10;
        beforeEach(function(){
            spyOn(ctrl, 'findPrice');
            ctrl.product = {};
            ctrl.currentOrder = mock.Order;
            directiveScope.vm = ctrl;
        });
        it('should create a watch if price breaks are defined', function(){
            ctrl.product = {PriceSchedule: {PriceBreaks: {Quantity: oldQty, Price: 3}}};
            ctrl.$onInit();
            ctrl.product.Quantity = newQty;
            directiveScope.$apply();
            expect(ctrl.findPrice).toHaveBeenCalledWith(newQty);
        })
        it('should not create a watch if price breaks are not defined', function(){
            ctrl.$onInit();
            ctrl.product.Quantity = newQty;
            directiveScope.$apply();
            expect(ctrl.findPrice).not.toHaveBeenCalled();
        });
    });

    describe('addToCart', function(){
        beforeEach(function(){
            spyOn(ocLineItemsService, 'AddItem').and.returnValue(dummyPromise);
            ctrl.currentOrder = mock.Order;
            ctrl.product = mock.Product;
        });
        it('should call ocLineItems.AddItem()', function(){
            ctrl.addToCart();
            expect(ocLineItemsService.AddItem).toHaveBeenCalledWith(mock.Order, mock.Product);
        });
    });

    describe('findPrice', function(){
        beforeEach(function(){
            ctrl.calculatedPrice = null;
            ctrl.product = {PriceSchedule: {PriceBreaks: [{Quantity: 1, Price: 5}, {Quantity: 2, Price: 3}]}};
        });
        it('should not call function if there is no qty parameter', function(){
            ctrl.findPrice();
            directiveScope.$digest();
            expect(ctrl.calculatedPrice).toBe(null);
        });
        it('given quantity 1 should give price 5', function(){
            ctrl.findPrice(1);
            directiveScope.$digest();
            expect(ctrl.calculatedPrice).toBe(5);
        });
        it('given quantity 5 should give price 15', function(){
            ctrl.findPrice(5);
            directiveScope.$digest();
            expect(ctrl.calculatedPrice).toBe(15);
        });
    });
});