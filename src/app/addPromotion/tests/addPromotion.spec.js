describe('Component: addPromotion', function(){
    var scope,
        rootScope,
        q,
        oc
        ;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope, $q, OrderCloud){
        scope = $rootScope.$new();
        rootScope = $rootScope;
        q = $q;
        oc = OrderCloud;
    }));
    describe('Component Directive: ocAddPromotion', function(){
        var addPromotionCtrl,
        toaster
        ;
        beforeEach(inject(function($componentController, toastr){
            toaster = toastr;
            addPromotionCtrl = $componentController('ocAddPromotion', {
                $scope: scope,
                $rootScope: rootScope,
                OrderCloud: oc,
                toastr: toaster
            });
        }));
        describe('submit', function(){
            var mockPromo,
                mockOrderID;
            beforeEach(function(){
                mockPromo = {Code:'Discount10'};
                mockOrderID = 'order123';

                var defer = q.defer();
                defer.resolve(mockPromo);
                spyOn(oc.Orders, 'AddPromotion').and.returnValue(defer.promise);
                spyOn(rootScope, '$broadcast');
                spyOn(toaster, 'success');
                addPromotionCtrl.submit(mockOrderID, mockPromo.Code);
            });
            it('should call Orders.AddPromotion', function(){
                expect(oc.Orders.AddPromotion).toHaveBeenCalledWith(mockOrderID, mockPromo.Code);
                scope.$digest();
                expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:UpdatePromotions', mockOrderID);
                expect(toaster.success).toHaveBeenCalledWith('Promo code ' +  mockPromo.Code + ' added!', 'Success');
            });
        });
    });
});