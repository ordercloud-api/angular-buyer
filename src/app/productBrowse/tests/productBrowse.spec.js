describe('Component: ProductBrowse', function(){
    var oc,
        parameters,
        currentUser,
        productList,
        categoryList;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module(function($provide) {
        $provide.value('Parameters', {search:null, page: null, pageSize: null, searchOn: null, sortBy: null, userID: null, userGroupID: null, level: null, buyerID: null})
        $provide.value('CurrentUser', {});
        $provide.value('ProductList', {});
        $provide.value('CategoryList', {});
    }));
    beforeEach(inject(function(OrderCloud, Parameters, ProductList, CategoryList){
        oc = OrderCloud;
        parameters = Parameters;
        currentUser = {
            ID: "U01",
            Username: "User01",
            FirstName: "Test",
            LastName: "User 01",
            Email: "test@four51.com",
            Phone: "5555555555",
            TermsAccepted: null,
            Active: true,
            xp: {
                FavoriteProducts: []
            },
            AvailableRoles: [
                "FullAccess"
            ]
        };
        productList = ProductList;
        categoryList = CategoryList;
    }));

    describe('State: productBrowse', function(){
        var state;
        beforeEach(inject(function($state, OrderCloudParameters){
            state = $state.get('productBrowse');
            spyOn(OrderCloudParameters, 'Get').and.returnValue(null);
            spyOn(oc.Me, 'ListCategories').and.returnValue(null);
        }));
        it('should resolve Parameters', inject(function($injector, OrderCloudParameters){
            $injector.invoke(state.resolve.Parameters);
            expect(OrderCloudParameters.Get).toHaveBeenCalled();
        }));
        it('should resolve CategoryList', inject(function($injector){
            $injector.invoke(state.resolve.CategoryList);
            expect(oc.Me.ListCategories).toHaveBeenCalledWith(null, 1, 100, null, null, null, 'all');
        }));
    });
    describe('State: productBrowse.products', function(){
        var state;
        beforeEach(inject(function($state, OrderCloudParameters){
            state = $state.get('productBrowse.products');
            spyOn(OrderCloudParameters, 'Get').and.returnValue(null);
            spyOn(oc.Me, 'ListProducts').and.returnValue(null);
        }));
        it('should resolve Parameters', inject(function($injector, OrderCloudParameters){
            $injector.invoke(state.resolve.Parameters);
            expect(OrderCloudParameters.Get).toHaveBeenCalled();
        }));
        it('should resolve ProductList', inject(function($injector){
            $injector.invoke(state.resolve.ProductList);
            expect(oc.Me.ListProducts).toHaveBeenCalledWith(parameters.search, parameters.page, parameters.pageSize, parameters.searchOn, parameters.sortBy, parameters.filters, parameters.categoryid);
        }));
    });
    //describe('Controller: ProductViewCtrl', function(){
    //    var productViewCtrl;
    //    beforeEach(inject(function($state, $controller){
    //        productViewCtrl = $controller('ProductViewCtrl', {
    //            ProductList: productList,
    //            CategoryList: categoryList
    //        });
    //    }));
    //    describe('LoadMore', function(){
    //        beforeEach(function(){
    //            productViewCtrl.list = {
    //                Meta: {
    //                    Page: '',
    //                    PageSize: ''
    //                },
    //                Items: {}
    //            };
    //            productViewCtrl.productList = productList;
    //            productViewCtrl.categoryList = categoryList;
    //            spyOn(oc.Me, 'ListProducts').and.returnValue(null);
    //            productViewCtrl.loadMore();
    //        });
    //        it('should call the Me ListProducts method', function(){
    //            expect(oc.Me.ListProducts).toHaveBeenCalledWith(parameters.search, productViewCtrl.list.Meta.Page + 1, parameters.pageSize || productViewCtrl.list.Meta.PageSize, parameters.searchOn, parameters.sortBy, parameters.filters);
    //        });
    //    });
    //});
});