describe('Component: Cart', function() {
    var scope,
        q,
        oc,
        currentOrder,
        currentPromotions,
       lineItemHelpers,
        lineItemsList,
        fakeOrder,
        user
        ;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module(function($provide) {
        $provide.value('CurrentOrder', {ID: "MockOrderID3456"});
    }));
    beforeEach(inject(function($rootScope, $q, OrderCloud, CurrentOrder, LineItemHelpers) {
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloud;
        currentOrder = CurrentOrder;
        lineItemHelpers = LineItemHelpers;
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
            "Items" : [{}, {}],
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

    describe('Configuration: CartConfig', function() {
        var state;
        beforeEach(inject(function($state) {
            state = $state.get('cart');
            var defer = q.defer();
            defer.resolve(lineItemsList);
            spyOn(oc.LineItems,'List').and.returnValue(defer.promise);
            spyOn(lineItemHelpers,'GetProductInfo').and.returnValue(defer.promise);

        }));
        it('should call LineItems.List',inject(function($injector){
            $injector.invoke(state.resolve.LineItemsList);
            expect(oc.LineItems.List).toHaveBeenCalledWith(currentOrder.ID);
        }));
        it('should call LineItemHelper', inject(function($injector){
            $injector.invoke(state.resolve.LineItemsList);
            scope.$digest();
            expect(lineItemHelpers.GetProductInfo).toHaveBeenCalled();
        }));
    });

    describe('Controller : CartController',function() {
        var cartController;
        var ocConfirm;
        beforeEach(inject(function($state, $controller, OrderCloudConfirm) {
            cartController = $controller('CartCtrl', {
                $scope: scope,
                CurrentPromotions: [],
                LineItemsList: lineItemsList,
                LineItemHelpers: lineItemHelpers
            });
            ocConfirm = OrderCloudConfirm;
            var defer = q.defer();
            defer.resolve(lineItemsList);
            spyOn(lineItemHelpers,'UpdateQuantity').and.returnValue(defer.promise);
            spyOn(ocConfirm,'Confirm').and.returnValue(defer.promise);
            spyOn(oc.Orders, 'Delete').and.returnValue(defer.promise);
            spyOn(oc.Orders,'Get').and.returnValue(defer.promise);
            spyOn(oc.LineItems, 'List').and.returnValue(defer.promise);
            spyOn(lineItemHelpers,'GetProductInfo').and.returnValue(defer.promise);
        }));

       describe('updateQuantity',function(){
          it('should call LineItemHelpers UpdateQuantity Method', function(){
              cartController.updateQuantity(currentOrder,lineItemsList.Items[0]);
              expect(lineItemHelpers.UpdateQuantity).toHaveBeenCalledWith(currentOrder,lineItemsList.Items[0]);
          }) ;
       });
        describe('CancelOrder',function() {
         it('should call OrderCloud Confirm modal prompt', function() {
             cartController.cancelOrder();
             expect(ocConfirm.Confirm).toHaveBeenCalled();
         });
         it('should call OC Orders Delete Method', function(){
             cartController.cancelOrder(fakeOrder);
             scope.$digest();
             expect(oc.Orders.Delete).toHaveBeenCalledWith(fakeOrder.ID);
         });
        });
        describe('OC:UpdateLineItem',function() {
            it('should call LineItems List Method', inject(function($rootScope) {
                $rootScope.$broadcast('OC:UpdateLineItem' ,fakeOrder);
                expect(oc.LineItems.List).toHaveBeenCalledWith(fakeOrder.ID);
            }));
            it('should call LineItemHelpers GetProductInfo Method', inject(function($rootScope) {
                $rootScope.$broadcast('OC:UpdateLineItem' ,fakeOrder);
                scope.$digest();
                expect(oc.LineItems.List).toHaveBeenCalledWith(fakeOrder.ID);
            }))
        });
    });
});