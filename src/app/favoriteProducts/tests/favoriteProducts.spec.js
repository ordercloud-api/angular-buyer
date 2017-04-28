describe('Component: FavoriteProducts', function(){
    var q,
        oc,
        scope,
        ocParams,
        parameters,
        favoriteProducts,
        currentUser,
        toaster,
        product;

    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module(function($provide) {
        $provide.value('Parameters', {search:null, page: null, pageSize: null, searchOn: null, sortBy: null, userID: null, userGroupID: null, level: null, buyerID: null});
        $provide.value('FavoriteProducts', []);
        $provide.value('CurrentUser', {xp: {FavoriteProducts: ['favoriteProduct']}});
    }));
    beforeEach(inject(function($q, OrderCloud, $rootScope, Parameters, ocParameters, CurrentUser, FavoriteProducts, toastr){
        q = $q;
        oc = OrderCloud;
        scope = $rootScope.$new();
        parameters = Parameters;
        ocParams = ocParameters;
        favoriteProducts = FavoriteProducts;
        currentUser = CurrentUser;
        toaster = toastr;
        product = {
            ID: 'productID'
        };
    }));

    describe('State: favoriteProducts', function(){
        var state;
        beforeEach(inject(function($state){
            state = $state.get('favoriteProducts');
            var defer = q.defer();
            defer.resolve();
            spyOn(ocParams, 'Get').and.returnValue(null);
            spyOn(oc.Me, 'ListProducts').and.returnValue(defer.promise);
        }));
        it('should resolve Parameters', inject(function($injector){
            $injector.invoke(state.resolve.Parameters);
            expect(ocParams.Get).toHaveBeenCalled();
        }));
        it('should resolve FavoriteProducts', inject(function(CurrentUser, $injector){
            $injector.invoke(state.resolve.FavoriteProducts);
            currentUser.xp = {favoriteProducts: 'favoriteProduct'};
            expect(oc.Me.ListProducts).toHaveBeenCalledWith(parameters.search, parameters.page, parameters.pageSize || 6, parameters.searchOn, parameters.sortBy, {ID: currentUser.xp.favoriteProducts});
        }));
    });
    describe('Controller: FavoriteProductCtrl', function(){
        var favoriteProductCtrl;
        beforeEach(inject(function($state, $controller, CurrentUser){
            scope ={};
            scope.currentUser = CurrentUser;
            scope.product = {
                ID: 'productID'
            };
            favoriteProductCtrl = $controller('FavoriteProductCtrl', {
                $scope: scope,
                OrderCloud: oc,
                toastr: toaster
            });
            var defer = q.defer();
            defer.resolve();
            spyOn(oc.Me, 'Patch').and.returnValue(defer.promise);
        }));

        describe('checkHasFavorites', function(){
            it('should call the Me Patch when no favoriteProducts xp', function(){
                scope.currentUser = {};
                favoriteProductCtrl.checkHasFavorites();
                expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteProducts: []}});

            });
        });

        describe('toggleFavoriteProduct', function(){
            beforeEach(function(){
                spyOn(_, 'without').and.returnValue('updatedList');
                spyOn(toaster, 'success');
            });

            it('should call the Me Patch method when deleting a product', function(){
                var updatedList = 'updatedList';
                favoriteProductCtrl.hasFavorites = true;
                favoriteProductCtrl.isFavorited = true;
                favoriteProductCtrl.toggleFavoriteProduct();
                expect(_.without).toHaveBeenCalled();
                expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteProducts: updatedList}});
            });
            it('should call the Me Patch method when adding a product', function(){
                var existingList = ['favoriteProduct', 'productID'];
                favoriteProductCtrl.hasFavorites = true;
                favoriteProductCtrl.isFavorited = false;
                favoriteProductCtrl.toggleFavoriteProduct();
                expect(oc.Me.Patch).toHaveBeenCalledWith({xp: {FavoriteProducts: existingList}});
            });
        });
    });
});