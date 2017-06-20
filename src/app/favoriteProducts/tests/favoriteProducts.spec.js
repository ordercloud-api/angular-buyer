describe('Component: FavoriteProducts', function(){
    var favoriteProductsService;
    beforeEach(inject(function(ocFavoriteProducts) {
        favoriteProductsService = ocFavoriteProducts;
    }));
    describe('State: favoriteProducts', function(){
        var favoriteProductState;
        beforeEach(inject(function(){
            var df = q.defer();
            df.resolve(mock.User.xp.FavoriteProducts);
            spyOn(favoriteProductsService, 'Get').and.returnValue(df.promise);

            favoriteProductState = state.get('favoriteProducts');
            spyOn(ocParametersService, 'Get');
            spyOn(oc.Me, 'ListProducts');
        }));
        it('should resolve Parameters', inject(function(){
            injector.invoke(favoriteProductState.resolve.Parameters);
            expect(ocParametersService.Get).toHaveBeenCalled();
        }));
        it('should resolve FavoriteProducts', inject(function(){
            injector.invoke(favoriteProductState.resolve.FavoriteProducts);
            var mockFilter = mock.User.xp.FavoriteProducts.join('|');
            expect(favoriteProductsService.Get).toHaveBeenCalled();
            scope.$digest();
            expect(mock.Parameters.filters.ID).toBe(mockFilter);
            expect(oc.Me.ListProducts).toHaveBeenCalledWith(mock.Parameters);
        }));
    });
    describe('Directive: ocFavoriteProduct', function(){
        var element,
            directiveScope,
            originalFaves,
            addedFaves,
            favedClass,
            unfavedClass;
        beforeEach(function(){
            var df = q.defer();
            df.resolve(true);
            spyOn(favoriteProductsService, 'Init').and.returnValue(df.promise);

            originalFaves = ['FavProd1', 'FavProd2'];
            addedFaves = ['FavProd1', 'FavProd2', 'PRODUCT_ID'];
            favedClass = "faved";
            unfavedClass = "unfaved"
    
            scope.product = mock.Product;
            element = compile('<button oc-favorite-product '
                            + 'product="product" '
                            + 'favorite-class=' + favedClass + ' '
                            + 'non-favorite-class=' + unfavedClass + '></button>')(scope);
            directiveScope = element.isolateScope();
        });

        it('should initialize the isolate scope', function(){
            expect(directiveScope.product).toEqual(mock.Product);
            expect(directiveScope.favoriteClass).toEqual(favedClass);
            expect(directiveScope.nonFavoriteClass).toEqual(unfavedClass);
        })
        describe ('initialize using ocFavoriteProducts.Init()', function() {
            it ('should call ocFavoriteProducts.Init()', function() {
                expect(favoriteProductsService.Init).toHaveBeenCalledWith(mock.Product.ID);
            })
            it ('should already have the unfaved class', function() {
                expect(element.hasClass(unfavedClass)).toBe(true);
            })
            it ('should update the class based on the result of ocFavoriteProducts.Init()', function() {
                scope.$digest();
                expect(element.hasClass(favedClass)).toBe(true);
            })
        })
        describe('when clicked', function(){
            var spyOnToggle;
            beforeEach(function() {
                spyOnToggle = function(returnValue) {
                    var df = q.defer();
                    df.resolve(returnValue);
                    spyOn(favoriteProductsService, 'Toggle').and.returnValue(df.promise);
                }
            })
            it ('should call ocFavoriteProducts.Toggle() with the product ID', function() {
                spyOnToggle();
                element.triggerHandler('click');
                expect(favoriteProductsService.Toggle).toHaveBeenCalledWith(mock.Product.ID);
            })
            it ('should update element class to unfaved if ocFavoriteProducts.Toggle() returns false', function() {
                spyOnToggle(false);
                element.triggerHandler('click');
                expect(element.hasClass(unfavedClass)).toBe(true);
            })
        });
    });

    describe('Controller: FavoriteProductsCtrl', function(){
        var favoriteProductsCtrl,
        products;
        beforeEach(inject(function($controller){
            favoriteProducts = {Items: [mock.Product], Meta: mock.Meta}
            favoriteProductsCtrl = $controller('FavoriteProductsCtrl', {
                FavoriteProducts: favoriteProducts
            });
        }));
        describe('filter', function(){
            beforeEach(function(){
                spyOn(state, 'go');
                spyOn(ocParametersService, 'Create').and.callThrough();
                favoriteProductsCtrl.filter(true);
            })
            it('should reload state with new parameters', function(){
                expect(ocParametersService.Create).toHaveBeenCalledWith(parametersResolve, true);
                var createdParams = ocParametersService.Create(parametersResolve, true);
                expect(createdParams).toBeDefined();
                expect(state.go).toHaveBeenCalledWith('.', createdParams);
            })
        });
        describe('clearFilters', function(){
            beforeEach(function(){
                spyOn(favoriteProductsCtrl, 'filter');
                favoriteProductsCtrl.clearFilters();
            });
            it('should call clear filters, reload state and reset page', function(){
                expect(favoriteProductsCtrl.parameters.filters).toBeNull();
                expect(favoriteProductsCtrl.filter).toHaveBeenCalledWith(true);
            });
        });
        describe('updateSort', function(){
            var mockVal = 'MOCK_VAL';
            beforeEach(function(){
                spyOn(favoriteProductsCtrl, 'filter');
            });
            it('if value passed in is equal to sortBy - set to !value', function(){
                favoriteProductsCtrl.parameters.sortBy = mockVal;
                favoriteProductsCtrl.updateSort(mockVal);

                expect(favoriteProductsCtrl.parameters.sortBy).toBeDefined();
                expect(favoriteProductsCtrl.parameters.sortBy).toBe('!' + mockVal);
            });
            it('if value passed in is equal to !sortBy - set to null', function(){
                favoriteProductsCtrl.parameters.sortBy = '!' + mockVal;
                favoriteProductsCtrl.updateSort(mockVal);

                expect(favoriteProductsCtrl.parameters.sortBy).toBeDefined();
                expect(favoriteProductsCtrl.parameters.sortBy).toBe(null);
            });
            it('if no value is passed in, set it to sortSelection', function(){
                var mockSelection = 'SORT_SELECTION';
                favoriteProductsCtrl.sortSelection = mockSelection;
                favoriteProductsCtrl.updateSort();

                expect(favoriteProductsCtrl.parameters.sortBy).toBeDefined();
                expect(favoriteProductsCtrl.parameters.sortBy).toBe(mockSelection);
            });
            it('should reload state with new filters - same page', function(){
                favoriteProductsCtrl.updateSort();
                expect(favoriteProductsCtrl.filter).toHaveBeenCalledWith(false);
            })
        });
        describe('reverseSort', function(){
            var mockVal;
            beforeEach(function(){
                mockVal = 'MOCK_VALUE';
                spyOn(favoriteProductsCtrl, 'filter');
            })
            it('should reverse sort - ascending to descending', function(){
                favoriteProductsCtrl.parameters.sortBy = mockVal;
                favoriteProductsCtrl.reverseSort();
                expect(favoriteProductsCtrl.parameters.sortBy).toBe('!' + mockVal);
            })
            it('should reverse sort - descending to ascending', function(){
                favoriteProductsCtrl.parameters.sortBy = '!' + mockVal;
                favoriteProductsCtrl.reverseSort();
                expect(favoriteProductsCtrl.parameters.sortBy).toBe(mockVal);
            })
            it('should reload state with new filters - same page', function(){
                favoriteProductsCtrl.reverseSort();
                expect(favoriteProductsCtrl.filter).toHaveBeenCalledWith(false);
            })
        });
        describe('pageChanged', function(){
            it('should reload state with page defined on Meta', function(){
                spyOn(state, 'go');
                favoriteProductsCtrl.pageChanged();
                expect(state.go).toHaveBeenCalledWith('.', {page: favoriteProductsCtrl.list.Meta.Page});
            })
        })
        describe('loadMore', function(){
            it('should call oc.Me.ListProducts with incremented page parameter', function(){
                spyOn(oc.Me, 'ListProducts').and.returnValue(dummyPromise);
                favoriteProductsCtrl.loadMore();
                favoriteProductsCtrl.parameters.page = favoriteProductsCtrl.list.Meta.Page + 1;
                expect(oc.Me.ListProducts).toHaveBeenCalledWith(favoriteProductsCtrl.parameters)
            })
        })
    });
});