//  TODO: F51-334
// describe('Component: FavoriteProducts', function(){
//     describe('State: favoriteProducts', function(){
//         var favoriteProductState;
//         beforeEach(inject(function(){
//             favoriteProductState = state.get('favoriteProducts');
//             spyOn(ocParametersService, 'Get');
//             spyOn(oc.Me, 'ListProducts');
//         }));
//         it('should resolve Parameters', inject(function(){
//             injector.invoke(favoriteProductState.resolve.Parameters);
//             expect(ocParametersService.Get).toHaveBeenCalled();
//         }));
//         it('should resolve FavoriteProducts', inject(function(){
//             injector.invoke(favoriteProductState.resolve.FavoriteProducts);
//             var mockFilter = mock.User.xp.FavoriteProducts.join('|');
//             expect(mock.Parameters.filters.ID).toBe(mockFilter);
//             expect(oc.Me.ListProducts).toHaveBeenCalledWith(mock.Parameters);
//         }));
//     });
//     describe('Controller: FavoriteProductCtrl', function(){
//         var favoriteProductCtrl;
//         beforeEach(inject(function($controller){
//             scope.currentUser = mock.User;
//             scope.product = mock.Product;
//             favoriteProductCtrl = $controller('FavoriteProductCtrl', {$scope: scope});
//         }));

//         describe('checkHasFavorites', function(){
//             beforeEach(function(){
//                 spyOn(oc.Me, 'Patch').and.returnValue(dummyPromise);
//             });
//             it('should set vm.hasFavorites to true if current user has favorite products', function(){
//                 scope.currentUser.xp.FavoriteProducts = ['FavProduct1', 'FavProduct2'];
//                 favoriteProductCtrl.checkHasFavorites();
//                 expect(favoriteProductCtrl.hasFavorites).toBe(true);
//             });
//             it('should call Me.Patch to empty array when no favoriteProducts xp', function(){
//                 delete scope.currentUser.xp.FavoriteProducts;
//                 favoriteProductCtrl.checkHasFavorites();
//                 expect(oc.Me.Patch).toHaveBeenCalledWith({xp: mock.User.xp});
//             });
//         });

//         describe('toggleFavoriteProduct', function(){
//             beforeEach(function(){
//                 spyOn(favoriteProductCtrl, 'addProduct');
//                 spyOn(favoriteProductCtrl, 'removeProduct');
//             });
//             it('if user has no favorites add product', function(){
//                 favoriteProductCtrl.hasFavorites = false;
//                 favoriteProductCtrl.toggleFavoriteProduct();
//                 expect(favoriteProductCtrl.addProduct).toHaveBeenCalledWith([]);
//             });
//             it('if user has favorites and product is favorited, remove product', function(){
//                 favoriteProductCtrl.hasFavorites = true;
//                 favoriteProductCtrl.isFavorited = true;
//                 favoriteProductCtrl.toggleFavoriteProduct();
//                 expect(favoriteProductCtrl.removeProduct).toHaveBeenCalled();
//             });
//             it('if user has favorites and product is not favorited, add product', function(){
//                 favoriteProductCtrl.hasFavorites = true;
//                 favoriteProductCtrl.isFavorited = false;
//                 favoriteProductCtrl.toggleFavoriteProduct();
//                 expect(favoriteProductCtrl.addProduct).toHaveBeenCalledWith(mock.User.xp.FavoriteProducts);
//             });
//         });

//         describe('addProduct', function(){
//             beforeEach(function(){
//                 spyOn(oc.Me, 'Patch').and.returnValue(dummyPromise);
//                 spyOn(toastrService, 'success')                
//                 favoriteProductCtrl.addProduct([]);
//             });
//             it('should add current product to users favorites', function(){
//                 var mockPatch = {xp:{FavoriteProducts:[scope.product.ID]}};
//                 expect(oc.Me.Patch).toHaveBeenCalledWith(mockPatch);
//             });
//             it('should call toastr to announce success', function(){
//                 scope.$digest();
//                 expect(toastrService.success).toHaveBeenCalledWith(scope.product.Name + ' was added to your favorite products.');
//             });
//             it('should visually display product is selected', function(){
//                 scope.$digest();
//                 expect(favoriteProductCtrl.isFavorited).toBe(true);
//             })
//         });

//         describe('removeProduct', function(){
//             beforeEach(function(){
//                 spyOn(oc.Me, 'Patch').and.returnValue(dummyPromise);
//                 spyOn(toastrService, 'success');
//                 scope.currentUser.xp.FavoriteProducts = ['PRODUCT_ID'];
//                 favoriteProductCtrl.removeProduct();
//             })
//             it('should remove current product from the users favorites', function(){
//                 expect(oc.Me.Patch).toHaveBeenCalledWith({xp:{FavoriteProducts: []}});
//             })
//             it('should call toastr to announce success', function(){
//                 scope.$digest();
//                 expect(toastrService.success).toHaveBeenCalledWith(scope.product.Name + ' was removed from your favorite products.');
//             });
//             it('should visually display product is no longer selected', function(){
//                 expect(favoriteProductCtrl.isFavorited).toBe(false);
//             });
//         });
//     });
//     describe('Controller: FavoriteProductsCtrl', function(){
//         var favoriteProductsCtrl,
//         products;
//         beforeEach(inject(function($controller){
//             scope.currentUser = mock.User;
//             favoriteProducts = {Items: [mock.Product], Meta: mock.Meta}
//             favoriteProductsCtrl = $controller('FavoriteProductsCtrl', {
//                 CurrentUser: currentUser,
//                 FavoriteProducts: favoriteProducts
//             });
//         }));
//         describe('filter', function(){
//             beforeEach(function(){
//                 spyOn(state, 'go');
//                 spyOn(ocParametersService, 'Create').and.callThrough();
//                 favoriteProductsCtrl.filter(true);
//             })
//             it('should reload state with new parameters', function(){
//                 expect(ocParametersService.Create).toHaveBeenCalledWith(parametersResolve, true);
//                 var createdParams = ocParametersService.Create(parametersResolve, true);
//                 expect(createdParams).toBeDefined();
//                 expect(state.go).toHaveBeenCalledWith('.', createdParams);
//             })
//         });
//         describe('clearFilters', function(){
//             beforeEach(function(){
//                 spyOn(favoriteProductsCtrl, 'filter');
//                 favoriteProductsCtrl.clearFilters();
//             });
//             it('should call clear filters, reload state and reset page', function(){
//                 expect(favoriteProductsCtrl.parameters.filters).toBeNull();
//                 expect(favoriteProductsCtrl.filter).toHaveBeenCalledWith(true);
//             });
//         });
//         describe('updateSort', function(){
//             var mockVal = 'MOCK_VAL';
//             beforeEach(function(){
//                 spyOn(favoriteProductsCtrl, 'filter');
//             });
//             it('if value passed in is equal to sortBy - set to !value', function(){
//                 favoriteProductsCtrl.parameters.sortBy = mockVal;
//                 favoriteProductsCtrl.updateSort(mockVal);

//                 expect(favoriteProductsCtrl.parameters.sortBy).toBeDefined();
//                 expect(favoriteProductsCtrl.parameters.sortBy).toBe('!' + mockVal);
//             });
//             it('if value passed in is equal to !sortBy - set to null', function(){
//                 favoriteProductsCtrl.parameters.sortBy = '!' + mockVal;
//                 favoriteProductsCtrl.updateSort(mockVal);

//                 expect(favoriteProductsCtrl.parameters.sortBy).toBeDefined();
//                 expect(favoriteProductsCtrl.parameters.sortBy).toBe(null);
//             });
//             it('if no value is passed in, set it to sortSelection', function(){
//                 var mockSelection = 'SORT_SELECTION';
//                 favoriteProductsCtrl.sortSelection = mockSelection;
//                 favoriteProductsCtrl.updateSort();

//                 expect(favoriteProductsCtrl.parameters.sortBy).toBeDefined();
//                 expect(favoriteProductsCtrl.parameters.sortBy).toBe(mockSelection);
//             });
//             it('should reload state with new filters - same page', function(){
//                 favoriteProductsCtrl.updateSort();
//                 expect(favoriteProductsCtrl.filter).toHaveBeenCalledWith(false);
//             })
//         });
//         describe('reverseSort', function(){
//             var mockVal;
//             beforeEach(function(){
//                 mockVal = 'MOCK_VALUE';
//                 spyOn(favoriteProductsCtrl, 'filter');
//             })
//             it('should reverse sort - ascending to descending', function(){
//                 favoriteProductsCtrl.parameters.sortBy = mockVal;
//                 favoriteProductsCtrl.reverseSort();
//                 expect(favoriteProductsCtrl.parameters.sortBy).toBe('!' + mockVal);
//             })
//             it('should reverse sort - descending to ascending', function(){
//                 favoriteProductsCtrl.parameters.sortBy = '!' + mockVal;
//                 favoriteProductsCtrl.reverseSort();
//                 expect(favoriteProductsCtrl.parameters.sortBy).toBe(mockVal);
//             })
//             it('should reload state with new filters - same page', function(){
//                 favoriteProductsCtrl.reverseSort();
//                 expect(favoriteProductsCtrl.filter).toHaveBeenCalledWith(false);
//             })
//         });
//         describe('pageChanged', function(){
//             it('should reload state with page defined on Meta', function(){
//                 spyOn(state, 'go');
//                 favoriteProductsCtrl.pageChanged();
//                 expect(state.go).toHaveBeenCalledWith('.', {page: favoriteProductsCtrl.list.Meta.Page});
//             })
//         })
//         describe('loadMore', function(){
//             it('should call oc.Me.ListProducts with incremented page parameter', function(){
//                 spyOn(oc.Me, 'ListProducts').and.returnValue(dummyPromise);
//                 favoriteProductsCtrl.loadMore();
//                 favoriteProductsCtrl.parameters.page = favoriteProductsCtrl.list.Meta.Page + 1;
//                 expect(oc.Me.ListProducts).toHaveBeenCalledWith(favoriteProductsCtrl.parameters)
//             })
//         })
//     });
// });