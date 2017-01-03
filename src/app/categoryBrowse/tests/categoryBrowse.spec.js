describe('Component: Category Browse', function(){
    var scope,
        q,
        oc,
        state,
        ocParameters,
        mockProductList,
        categoryList
        ;
    beforeEach(module(function($provide) {
        $provide.value('Parameters', {categoryPage: null, productPage: null,  pageSize: null, sortBy: null, filters: null, categoryID:null});
    }));
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope, $q, OrderCloud, OrderCloudParameters, $state){
        scope = $rootScope.$new();
        q = $q;
        oc = OrderCloud;
        state = $state;
        ocParameters = OrderCloudParameters;
        categoryList = ['category1', 'category2'];
        mockProductList = {
            Items:['product1', 'product2'],
            Meta:{
                ItemRange:[1, 3],
                TotalCount: 50
            }
        };
    }));

    describe('State: categoryBrowse', function(){
        var state;
        beforeEach(inject(function($state){
            state = $state.get('categoryBrowse');
            var defer = q.defer();
            defer.resolve();
            spyOn(ocParameters, 'Get');
            spyOn(oc.Me, 'ListCategories');
            spyOn(oc.Me, 'ListProducts');
        }));
        it('should resolve Parameters', inject(function($injector){
            $injector.invoke(state.resolve.Parameters);
            expect(ocParameters.Get).toHaveBeenCalled();
        }));
        it('should resolve CategoryList', inject(function($injector){
            $injector.invoke(state.resolve.CategoryList);
            expect(oc.Me.ListCategories).toHaveBeenCalled();
        }));
        it('CategoryList resolve should return subcategories of categoryID', inject(function($injector, Parameters){
            Parameters.categoryID = '12';
            $injector.invoke(state.resolve.CategoryList);
            expect(oc.Me.ListCategories).toHaveBeenCalledWith(null, null, 12, null, null, {ParentID:'12'}, 1);
        }));
        it('should resolve ProductList', inject(function($injector, Parameters){
            Parameters.filters = {ParentID:'12'};
            $injector.invoke(state.resolve.ProductList);
            expect(oc.Me.ListProducts).toHaveBeenCalled();
        }));
        it('ProductList should not return products when there is no ParentID filter', inject(function($injector){
            //we don't want to return products on the top category level
            $injector.invoke(state.resolve.ProductList);
            expect(oc.Me.ListProducts).not.toHaveBeenCalled();
        }));
    });

    describe('Controller: CategoryBrowseController', function(){
        var categoryBrowseCtrl;
        beforeEach(inject(function($state, $controller, Parameters){
            var state = $state;
            var selectedCategory = 'category1';
            categoryBrowseCtrl = $controller('CategoryBrowseCtrl', {
                $scope: scope,
                $state: state,
                OrderCloudParameters: ocParameters,
                CategoryList: categoryList,
                ProductList: mockProductList,
                Parameters: Parameters,
                SelectedCategory: selectedCategory
            });
            spyOn(state, 'go');
            spyOn(ocParameters, 'Create');
        }));
        describe('filter', function(){
            it('should reload state and call OrderCloudParameters.Create with any parameters', function(){
                categoryBrowseCtrl.parameters = {pageSize: 1};
                categoryBrowseCtrl.filter(true);
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith({pageSize:1}, true);
            });
        });
        describe('updateCategoryList', function(){
            it('should reload state with new category ID parameter', function(){
                categoryBrowseCtrl.updateCategoryList('newCategoryID');
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith({categoryPage: null, productPage: null,  pageSize: null, sortBy: null, filters: null, categoryID:'newCategoryID'}, true);
            });
        });
        describe('changeCategoryPage', function(){
            it('should reload state with the new categoryPage', function(){
                categoryBrowseCtrl.changeCategoryPage('newCategoryPage');
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith({categoryPage: 'newCategoryPage', productPage: null,  pageSize: null, sortBy: null, filters: null, categoryID: null}, false);
            });
        });
        describe('changeProductPage', function(){
            it('should reload state with the new productPage', function(){
                categoryBrowseCtrl.changeProductPage('newProductPage', function(){
                expect(state.go).toHaveBeenCalled();
                expect(ocParameters.Create).toHaveBeenCalledWith({categoryPage: null, productPage: 'newProductPage',  pageSize: null, sortBy: null, filters: null, categoryID: null}, false);
                });
            });
        });
    });
});