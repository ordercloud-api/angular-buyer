describe('Component: Category Browse', function(){
    describe('State: categoryBrowse', function(){
        var browseState;
        beforeEach(function(){
            browseState = state.get('categoryBrowse');
            spyOn(ocParametersService, 'Get');
            spyOn(oc.Me, 'ListCategories');
            spyOn(oc.Me, 'ListProducts');
        });
        it('should resolve Parameters', function(){
            injector.invoke(browseState.resolve.Parameters);
            expect(ocParametersService.Get).toHaveBeenCalled();
        });
        it('should resolve CategoryList', function(){
            injector.invoke(browseState.resolve.CategoryList);
            expect(oc.Me.ListCategories).toHaveBeenCalled();
        });
        it('should return subcategories of Parameters.categoryID', function(){
            parametersResolve.categoryID = mock.Category.ID;
            injector.invoke(browseState.resolve.CategoryList);
            expect(oc.Me.ListCategories).toHaveBeenCalledWith(parametersResolve);
        });
        it('should resolve ProductList', function(){
            parametersResolve.filters = {ParentID:mock.Category.ID};
            injector.invoke(browseState.resolve.ProductList);
            expect(oc.Me.ListProducts).toHaveBeenCalledWith(parametersResolve);
        });
        it('ProductList should not return products when there is no ParentID filter', function(){
            //we don't want to return products on the top category level
            injector.invoke(browseState.resolve.ProductList);
            expect(oc.Me.ListProducts).not.toHaveBeenCalled();
        });
    });

    describe('Controller: CategoryBrowseController', function(){
        var categoryBrowseCtrl;
        beforeEach(inject(function($controller){
            categoryBrowseCtrl = $controller('CategoryBrowseCtrl', {
                CategoryList: {
                    Items : [mock.Category, mock.Category],
                    Meta : mock.Meta
                },
                ProductList: {
                    Items : [mock.Product, mock.Product],
                    Meta : mock.Meta
                },
                SelectedCategory: mock.Category
            });
            spyOn(state, 'go');
            spyOn(ocParametersService, 'Create');
        }));
        describe('vm.filter', function(){
            it('should reload state and call ocParameters.Create with any parameters', function(){
                categoryBrowseCtrl.filter(true);
                expect(state.go).toHaveBeenCalled();
                expect(ocParametersService.Create).toHaveBeenCalledWith(mock.Parameters, true);
            });
        });
        describe('vm.updateCategoryList', function(){
            it('should reload state with new category ID parameter', function(){
                categoryBrowseCtrl.updateCategoryList(mock.Category.ID);
                expect(state.go).toHaveBeenCalled();
                expect(ocParametersService.Create).toHaveBeenCalledWith(angular.extend(parametersResolve, {categoryID:mock.Category.ID}), true);
            });
        });
        describe('vm.changeCategoryPage', function(){
            it('should reload state with the new categoryPage', function(){
                categoryBrowseCtrl.changeCategoryPage(1);
                expect(state.go).toHaveBeenCalled();
                expect(ocParametersService.Create).toHaveBeenCalledWith(angular.extend(parametersResolve, {categoryPage:1}), false);
            });
        });
        describe('vm.changeProductPage', function(){
            it('should reload state with the new productPage', function(){
                categoryBrowseCtrl.changeProductPage(1, function(){
                expect(state.go).toHaveBeenCalled();
                expect(ocParametersService.Create).toHaveBeenCalledWith(angular.extend(parametersResolve, {productPage:1}), false);
                });
            });
        });
    });
});