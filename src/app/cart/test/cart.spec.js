describe('Component: Cart', function() {
    describe('State: Cart', function() {
        var cartState;
        beforeEach(function() {
            cartState = state.get('cart');
            spyOn(oc.LineItems, 'List');
            spyOn(oc.Orders, 'ListPromotions');
        });
        it('should call LineItems.List', function(){
            injector.invoke(cartState.resolve.LineItemsList);
            expect(oc.LineItems.List).toHaveBeenCalledWith('outgoing', currentOrder.ID);
        });
        it('should call Orders.ListPromotions', function(){
            injector.invoke(cartState.resolve.CurrentPromotions);
            scope.$digest();
            expect(oc.Orders.ListPromotions).toHaveBeenCalledWith('outgoing', currentOrder.ID);
        });
    });

    describe('Controller : CartController', function() {
        var cartController,
            lineItemsList = {
                Items : [mock.LineItem, mock.LineItem],
                Meta : mock.Meta
            },
            promoList = {
                Items : [mock.Promotion, mock.Promotion],
                Meta : mock.Meta
            }
        beforeEach(inject(function($controller) {
            cartController = $controller('CartCtrl', {
                $scope: scope,
                CurrentPromotions: promoList,
                LineItemsList: lineItemsList
            });
        }));

        describe('$rootScope.$on("OC:UpdatePromotions")', function(){
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

        describe('vm.removeItem', function() {
            beforeEach(function() {
                spyOn(oc.LineItems, 'Delete').and.returnValue(dummyPromise);
                spyOn(scope, '$emit');
            });
            it('should delete the line item', function() {
                var lineItem = angular.copy(lineItemsList.Items[0]); //list gets mutated after deletion so save copy
                cartController.removeItem(mock.Order, {$index:0, lineItem: lineItem});
                scope.$digest();
                expect(oc.LineItems.Delete).toHaveBeenCalledWith('outgoing', mock.Order.ID, lineItem.ID);
                scope.$digest();
                expect(scope.$emit).toHaveBeenCalledWith('OC:UpdateOrder', mock.Order.ID, {lineItems: lineItem, subtract: true});
                scope.$digest();
                expect(cartController.lineItems.Items).toEqual([mock.LineItem]);
            });
        });

        describe('vm.removePromotion', function(){
            beforeEach(function(){
                spyOn(oc.Orders, 'RemovePromotion').and.returnValue(dummyPromise);
                spyOn(scope, '$emit');
            });
            it('should call oc.Orders.RemovePromotion', function(){
                var mockRequest = {$index: 0, promotion: mock.Promotion};
                cartController.removePromotion(mock.Order, mockRequest);
                scope.$digest();
                expect(oc.Orders.RemovePromotion).toHaveBeenCalledWith('outgoing', mock.Order.ID, mock.Promotion.Code);
                scope.$digest();
                expect(scope.$emit).toHaveBeenCalledWith('OC:UpdateOrder', mock.Order.ID);
            });
        });

        describe('vm.cancelOrder',function() {
            beforeEach(function() {
                spyOn(ocConfirmService, 'Confirm').and.returnValue(dummyPromise);
                spyOn(oc.Orders, 'Delete').and.returnValue(dummyPromise);
            });
            it('should call OrderCloud Confirm modal prompt', function() {
                cartController.cancelOrder();
                expect(ocConfirmService.Confirm).toHaveBeenCalled();
            });
            it('should call OC Orders Delete Method', function(){
                cartController.cancelOrder(mock.Order);
                scope.$digest();
                expect(oc.Orders.Delete).toHaveBeenCalledWith('outgoing', mock.Order.ID);
            });
        });
    });
});