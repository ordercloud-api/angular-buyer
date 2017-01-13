describe('Component: Cart', function() {
    var scope,
        q,
        oc,
        currentOrder,
        rootScope,
        lineItemsList,
        _ocLineItems,
        fakeOrder,
        user
        ;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module(function($provide) {
        $provide.value('CurrentOrder', {ID: "MockOrderID3456"});
    }));
    beforeEach(inject(function($rootScope, $q, OrderCloud, ocLineItems, CurrentOrder) {
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloud;
        _ocLineItems = ocLineItems;
        currentOrder = CurrentOrder;
        rootScope = $rootScope;
        fakeOrder = {
            ID: "TestOrder123456789",
            Type: "Standard",
            FromUserID: "TestUser123456789",
            BillingAddressID: "TestAddress123456789",
            ShippingAddressID: "TestAddress123456789",
            SpendingAccountID: null,
            Comments: null,
            PaymentMethod: null,
            CreditCardID: null,
            ShippingCost: null,
            TaxCost: null
        };
        lineItemsList = {
            "Items" : [{ID:"LI1"}, {ID:"LI2"}],
            "Meta" : {
                "Page": 1,
                "PageSize": 20,
                "TotalCount":29,
                "TotalPages": 3,
                "ItemRange" : [1,2]
            }
        };
        user = {
            ID: "TestUser132456789",
            xp: {
                defaultShippingAddressID: "TestAddress123456789",
                defaultBillingAddressID: "TestAddress123456789",
                defaultCreditCardID: "creditCard"
            }

        };
    }));

    describe('State: Cart', function() {
        var state;
        beforeEach(inject(function($state) {
            state = $state.get('cart');
            var defer = q.defer();
            defer.resolve(lineItemsList);
            spyOn(oc.LineItems,'List').and.returnValue(defer.promise);
            spyOn(_ocLineItems,'GetProductInfo').and.returnValue(defer.promise);

        }));
        it('should call LineItems.List',inject(function($injector){
            $injector.invoke(state.resolve.LineItemsList);
            expect(oc.LineItems.List).toHaveBeenCalledWith(currentOrder.ID);
        }));
        it('should call LineItemHelper', inject(function($injector){
            $injector.invoke(state.resolve.LineItemsList);
            scope.$digest();
            expect(_ocLineItems.GetProductInfo).toHaveBeenCalled();
        }));
    });

    describe('Controller : CartController',function() {
        var cartController;
        var confirm;
        beforeEach(inject(function($state, $controller, ocConfirm) {
            cartController = $controller('CartCtrl', {
                $scope: scope,
                CurrentPromotions: [],
                LineItemsList: lineItemsList
            });
            confirm = ocConfirm;
            var defer = q.defer();
            defer.resolve(lineItemsList);
            spyOn(rootScope, '$broadcast');
        }));

        describe('removeItem()', function() {
            beforeEach(function() {
                var df = q.defer();
                df.resolve();
                spyOn(oc.LineItems, 'Delete').and.returnValue(df.promise);
            });
            it ('should delete the line item', function() {
                cartController.removeItem(fakeOrder, {$index:0, lineItem: lineItemsList.Items[0]});
                expect(oc.LineItems.Delete).toHaveBeenCalledWith(fakeOrder.ID, lineItemsList.Items[0].ID);
                scope.$digest();
                expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:UpdateOrder', fakeOrder.ID);
                expect(cartController.lineItems.Items).toEqual([{ID:"LI2"}]);
            })
        });

        describe('CancelOrder',function() {
            beforeEach(function() {
                var df = q.defer();
                df.resolve();
                spyOn(confirm,'Confirm').and.returnValue(df.promise);
                spyOn(oc.Orders, 'Delete').and.returnValue(df.promise);
            });
            it('should call OrderCloud Confirm modal prompt', function() {
                cartController.cancelOrder();
                expect(confirm.Confirm).toHaveBeenCalled();
            });
            it('should call OC Orders Delete Method', function(){
                cartController.cancelOrder(fakeOrder);
                scope.$digest();
                expect(oc.Orders.Delete).toHaveBeenCalledWith(fakeOrder.ID);
            });
        });
    });
});