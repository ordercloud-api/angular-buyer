describe('Component: FavoriteOrders', function(){
    var q,
        oc,
        scope,
        toaster
        ;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, OrderCloud, $rootScope, toastr){
        q = $q;
        oc = OrderCloud;
        scope = $rootScope.$new();
        toaster = toastr;
    }));
    describe('Controller: FavoriteOrderCtrl', function(){
        var favoriteOrderCtrl;
        beforeEach(inject(function($componentController){
            favoriteOrderCtrl = $componentController('ordercloudFavoriteOrder', {
                $scope: scope,
                OrderCloud: oc,
                toastr: toaster
            });

        }));
        describe('toggleFavoriteOrder', function(){
            var mockOrderID,
                mockFavoriteOrder
                ;
            beforeEach(function(){
                mockOrderID = 'OrderID123';
                favoriteOrderCtrl.order = {ID: mockOrderID};
                mockFavoriteOrder = 'FavoriteOrder1';
                favoriteOrderCtrl.currentUser = {xp: {FavoriteOrders: [mockFavoriteOrder]}};

                var defer = q.defer();
                defer.resolve();
                spyOn(oc.Me, 'Patch').and.returnValue(defer.promise);
                spyOn(toaster, 'success');
            });
            it('should add to favorites if user doesnt have any favorite orders', function(){
                favoriteOrderCtrl.hasFavorites = false;
                favoriteOrderCtrl.toggleFavoriteOrder();
                expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteOrders: [mockOrderID]}});
                scope.$digest();
                expect(favoriteOrderCtrl.isFavorited).toBe(true);
                expect(toaster.success).toHaveBeenCalledWith('Order added to your favorites', 'Success');
            });
            it('should add to favorites if user has favorites list, but the order isnt included in the list', function(){
                favoriteOrderCtrl.hasFavorites = true;
                favoriteOrderCtrl.isFavorited = false;
                favoriteOrderCtrl.toggleFavoriteOrder();
                expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteOrders: [mockFavoriteOrder, mockOrderID]}});
                scope.$digest();
                expect(favoriteOrderCtrl.isFavorited).toBe(true);
                expect(toaster.success).toHaveBeenCalledWith('Order added to your favorites', 'Success');
            });
            it('should remove order from favorite list, if order is already on list', function(){
                favoriteOrderCtrl.hasFavorites = true;
                favoriteOrderCtrl.isFavorited = true;
                favoriteOrderCtrl.order = {ID: mockFavoriteOrder};
                favoriteOrderCtrl.toggleFavoriteOrder();
                expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteOrders: [ ]}});
                scope.$digest();
                expect(favoriteOrderCtrl.isFavorited).toBe(false);
                expect(toaster.success).toHaveBeenCalledWith('Order removed from your favorites', 'Success');
            });
        });
    });
});