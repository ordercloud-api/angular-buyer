describe('Factory: ocLineItem', function() {
    var scope,
        q,
        oc,
        _ocLineItems,
        order = {
            ID: "FAKE_ORDER_ID",
            LineItems: []
        },
        product = {
            ID: "FAKE_PRODUCT_ID",
            Quantity: 2
        };
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope, $q, OrderCloud, ocLineItems) {
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloud;
        _ocLineItems = ocLineItems;
    }));
    describe('AddItem', function() {
        it ('should start up a new $q.defer()', function() {
            spyOn(q, 'defer').and.callThrough();
            _ocLineItems.AddItem(order, product);
            expect(q.defer).toHaveBeenCalled();
        });
        it ('should call OrderCloud.LineItems.Create()', function() {
            var defer = q.defer();
            defer.resolve("NEW_LINE_ITEM");
            spyOn(oc.LineItems, 'Create').and.returnValue(defer.promise);

            _ocLineItems.AddItem(order, product);
            expect(oc.LineItems.Create).toHaveBeenCalledWith(order.ID, {
                ProductID: product.ID,
                Quantity: product.Quantity,
                Specs: [],
                ShippingAddressID: null
            });
        });
    });
});