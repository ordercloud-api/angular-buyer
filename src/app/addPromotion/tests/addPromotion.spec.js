describe('Component: addPromotion', function(){
    var addPromotionCtrl;
    beforeEach(inject(function($componentController){
        addPromotionCtrl = $componentController('ocAddPromotion', {
            $scope: scope,
            $rootScope: rootScope,
            OrderCloud: oc,
            toastr: toastrService
        });
    }));
    describe('submit', function(){
        beforeEach(function(){
            var defer = q.defer();
            defer.resolve(mock.Promotion);
            spyOn(oc.Orders, 'AddPromotion').and.returnValue(defer.promise);
            spyOn(rootScope, '$broadcast');
            spyOn(toastrService, 'success');
            addPromotionCtrl.submit(mock.Order.ID, mock.Promotion.Code);
        });
        it('should call Orders.AddPromotion', function(){
            expect(oc.Orders.AddPromotion).toHaveBeenCalledWith('outgoing', mock.Order.ID, mock.Promotion.Code);
            scope.$digest();
            expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:UpdatePromotions', mock.Order.ID);
            expect(toastrService.success).toHaveBeenCalledWith('Promo code ' +  mock.Promotion.Code + ' successfully added.');
        });
    });
});