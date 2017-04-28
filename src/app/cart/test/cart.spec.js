describe('Component: Cart', function() {
    var scope,
        q,
        oc,
        currentOrder,
        rootScope,
        lineItemsList,
        promoList,
        fakeOrder
        ;
    beforeEach(module('orderCloud'));
    beforeEach(module('ordercloud-angular-sdk'));
    beforeEach(module(function($provide) {
        $provide.value('CurrentOrder', {ID: 'MockOrderID3456'});
    }));
    beforeEach(inject(function($rootScope, $q, OrderCloudSDK, CurrentOrder) {
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloudSDK;
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
        promoList = {
            "Items": [{ID:"Promo1"}, {ID: "Promot2"}],
            "Meta": {
                "Page": 1,
                "PageSize": 20,
                "TotalCount":29,
                "TotalPages": 3,
                "ItemRange" : [1,2]
            }
        }
    }));

    describe('State: Cart', function() {
        var state;
        beforeEach(inject(function($state) {
            state = $state.get('cart');
            var defer = q.defer();
            defer.resolve(lineItemsList);

            var promoDefer = q.defer();
            defer.resolve(promoList);

            spyOn(oc.LineItems, 'List').and.returnValue(defer.promise);
            spyOn(oc.Orders, 'ListPromotions').and.returnValue(promoDefer.promise);

        }));
        it('should call LineItems.List', inject(function($injector){
            $injector.invoke(state.resolve.LineItemsList);
            expect(oc.LineItems.List).toHaveBeenCalledWith('outgoing', currentOrder.ID);
        }));
        it('should call Orders.ListPromotions', inject(function($injector){
            $injector.invoke(state.resolve.CurrentPromotions);
            scope.$digest();
            expect(oc.Orders.ListPromotions).toHaveBeenCalledWith('outgoing', currentOrder.ID);
        }));
    });

    describe('Controller : CartController', function() {
        var cartController;
        var confirm;
        beforeEach(inject(function($controller, ocConfirm) {
            cartController = $controller('CartCtrl', {
                $scope: scope,
                $rootScope: rootScope,
                CurrentPromotions: promoList,
                LineItemsList: lineItemsList
            });
            confirm = ocConfirm;
        }));

        describe('OC:UpdatePromotions', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve({Meta:{}, Items: []});
                spyOn(oc.Orders, 'ListPromotions').and.returnValue(defer.promise);
            });
            it('should update value of promotionsList', function(){
                expect(cartController.promotions).toEqual(promoList.Items);
                rootScope.$broadcast('OC:UpdatePromotions', currentOrder.ID);
                scope.$digest();
                expect(oc.Orders.ListPromotions).toHaveBeenCalledWith('outgoing', currentOrder.ID);
                scope.$digest();
                expect(cartController.promotions).toEqual([]);
            });
        });

        describe('removeItem', function() {
            beforeEach(function() {
                var df = q.defer();
                df.resolve();
                spyOn(oc.LineItems, 'Delete').and.returnValue(df.promise);
                spyOn(rootScope, '$broadcast');
            });
            it('should delete the line item', function() {
                var lineItem = angular.copy(lineItemsList.Items[0]); //list gets mutated after deletion so save copy
                cartController.removeItem(fakeOrder, {$index:0, lineItem: lineItem});
                scope.$digest();
                expect(oc.LineItems.Delete).toHaveBeenCalledWith('outgoing', fakeOrder.ID, lineItem.ID);
                scope.$digest();
                expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:UpdateOrder', fakeOrder.ID);
                scope.$digest();
                expect(cartController.lineItems.Items).toEqual([{ID: "LI2"}]);
            });
        });

        describe('removePromotions', function(){
            beforeEach(function(){
                var d = q.defer();
                d.resolve();
                spyOn(oc.Orders, 'RemovePromotion').and.returnValue(d.promise);
                spyOn(rootScope, '$broadcast');
            });
            it('should call oc.Orders.RemovePromotion', function(){
                var mockScope = {$index: 0, promotion: {Code: 'Promo123'}};
                cartController.removePromotion(fakeOrder, mockScope);
                scope.$digest();
                expect(oc.Orders.RemovePromotion).toHaveBeenCalledWith('outgoing', fakeOrder.ID, mockScope.promotion.Code);
                scope.$digest();
                expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:UpdateOrder', fakeOrder.ID);
            });
        });

        describe('cancelOrder',function() {
            beforeEach(function() {
                var df = q.defer();
                df.resolve();
                spyOn(confirm, 'Confirm').and.returnValue(df.promise);
                spyOn(oc.Orders, 'Delete').and.returnValue(df.promise);
            });
            it('should call OrderCloud Confirm modal prompt', function() {
                cartController.cancelOrder();
                expect(confirm.Confirm).toHaveBeenCalled();
            });
            it('should call OC Orders Delete Method', function(){
                cartController.cancelOrder(fakeOrder);
                scope.$digest();
                expect(oc.Orders.Delete).toHaveBeenCalledWith('outgoing', fakeOrder.ID);
            });
        });
    });
});