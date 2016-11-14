describe('Catalog-Select:', function(){
    var q,
        scope,
        oc;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope, OrderCloud){
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloud;
    }));

    describe('Directive: ordercloudSelectCatalog', function(){
       var element;
       beforeEach(inject(function($compile) {
           var dfd1 = q.defer();
           var dfd2 = q.defer();
           dfd1.resolve('Catalog');
           dfd2.resolve('Catalogs');
           spyOn(oc.Catalogs, 'ListAssignments').and.returnValue(dfd1.promise);
           spyOn(oc.BuyerID, 'Get').and.returnValue(dfd2.promise);
           element = $compile('<ordercloud-select-catalog></ordercloud-select-catalog>')(scope);
           scope.$digest();
       }));
       it('should initialize the controller', function(){
           expect(oc.Catalogs.ListAssignments).toHaveBeenCalledWith(oc.BuyerID.Get());
           expect(element.isolateScope().selectCatalog).not.toBe(undefined);
       });
       it('should initialize a list of catalogs', function(){
           expect(element.isolateScope().selectCatalog.CatalogList).toBe('Catalogs');
       });
       it('should initialize the selected catalog', function(){
           expect(element.isolateScope().selectCatalog.selectedCatalog).toBe('Catalog');
       });
       it('should initialize a list of catalogs', function(){
           expect(element.isolateScope().selectCatalog.CatalogList).toBe('Catalogs');
       })
    });
});