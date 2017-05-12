describe('Component: FavoriteOrders', function(){
    describe('Controller: FavoriteOrderCtrl', function(){
        var favoriteOrderCtrl;
        beforeEach(inject(function($componentController){
            favoriteOrderCtrl = $componentController('ordercloudFavoriteOrder', {});

        }));
        describe('toggleFavoriteOrder', function(){
            beforeEach(function(){
                mock.Order.ID = 'OrderID123';
                favoriteOrderCtrl.order = {ID: mock.Order.ID};
                mockFavoriteOrder = 'FavoriteOrder1';
                favoriteOrderCtrl.currentUser = {xp: {FavoriteOrders: [mockFavoriteOrder]}};
                spyOn(oc.Me, 'Patch').and.returnValue(dummyPromise);
                spyOn(toastrService, 'success');
            });
            it('should add to favorites if user doesnt have any favorite orders', function(){
                favoriteOrderCtrl.hasFavorites = false;
                favoriteOrderCtrl.isFavorited = false;
                favoriteOrderCtrl.toggleFavoriteOrder();
                expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteOrders: [mock.Order.ID]}});
                scope.$digest();
                expect(favoriteOrderCtrl.isFavorited).toBe(true);
            });
            it('should add to favorites if user has favorites list, but the order isnt included in the list', function(){
                favoriteOrderCtrl.hasFavorites = true;
                favoriteOrderCtrl.isFavorited = false;
                favoriteOrderCtrl.toggleFavoriteOrder();
                expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteOrders: [mockFavoriteOrder, mock.Order.ID]}});
                scope.$digest();
                expect(favoriteOrderCtrl.isFavorited).toBe(true);
            });
            it('should remove order from favorite list, if order is already on list', function(){
                favoriteOrderCtrl.hasFavorites = true;
                favoriteOrderCtrl.isFavorited = true;
                favoriteOrderCtrl.order = {ID: mockFavoriteOrder};
                favoriteOrderCtrl.toggleFavoriteOrder();
                expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteOrders: [ ]}});
                scope.$digest();
                expect(favoriteOrderCtrl.isFavorited).toBe(false);
                expect(toastrService.success).toHaveBeenCalledWith('Removed from your favorite orders', 'Success');
            });
        });
    });
});