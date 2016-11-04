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

       }))
    });
});