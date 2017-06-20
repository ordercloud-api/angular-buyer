describe('Directive: ocFavoriteOrder', function(){
    var element,
        previousOrder,
        directiveScope
    ;

    beforeEach(function(){
        scope.orderToFav = mock.Order;
        scope.currentUser = mock.User;

        element = compile('<button oc-favorite-order="orderToFav"' 
                        + ' current-user="currentUser" ' 
                        + 'favorite-class="full-heart" ' 
                        + 'non-favorite-class="empty-heart">Click to Favorite!</button>')(scope);
        directiveScope = element.isolateScope();
        spyOn(oc.Me, 'Patch').and.returnValue(dummyPromise);
        spyOn(toastrService, 'success');
        
    });
    it('should initialize isolate the isolate scope',function(){
        expect(directiveScope.ocFavoriteOrder).toEqual(mock.Order);
        expect(directiveScope.currentUser).toEqual(mock.User);
        expect(directiveScope.favoriteClass).toEqual('full-heart');
        expect(directiveScope.nonFavoriteClass).toEqual('empty-heart');
    });
    it('should add to favorites if user doesnt have any favorite orders', function(){
        directiveScope.hasFavorites = false;
        directiveScope.isFavorited = false;
        element.triggerHandler('click');
        expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteOrders: [mock.Order.ID]}});
        scope.$digest();
        expect(directiveScope.isFavorited).toBe(true);
    });
    it('should add to favorites if user has favorites list, but the order isnt included in the list', function(){
        directiveScope.hasFavorites = true;
        directiveScope.isFavorited = false;
        element.triggerHandler('click');
        var mockFavOrders = mock.User.xp.FavoriteOrders;
        mockFavOrders.push(mock.Order.ID)
        expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteOrders: mockFavOrders}});
        scope.$digest();
        expect(directiveScope.isFavorited).toBe(true);
    });
    it('should remove order from favorite list, if order is already on list', function(){
        directiveScope.hasFavorites = true;
        directiveScope.isFavorited = true;
        directiveScope.currentUser.xp.FavoriteOrders = [mock.Order.ID]
        element.triggerHandler('click');
        expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteOrders: []}});
        scope.$digest();
        expect(directiveScope.isFavorited).toBe(false);
        scope.$digest();
        expect(toastrService.success).toHaveBeenCalledWith('Removed from your favorite orders', 'Success');
    });
});