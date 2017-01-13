describe('Component: Search', function() {
    var scope;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module('ordercloud-search'));
    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));
    describe('Directive: ordercloudSearch', function() {
        var element;
        beforeEach(inject(function($compile) {
            scope.ctrl = {
                searchTerm: ''
            };
            element = $compile('<ordercloud-search servicename="Products" controlleras="ctrl"></ordercloud-search>')(scope);
            scope.$digest();
        }));
        it('should initialize the isolate scope', function() {
            expect(element.isolateScope().servicename).toBe('Products');
            expect(element.isolateScope().controlleras).toEqual({searchTerm: ''});
        });
    });
    describe('Controller: ordercloudSearchCtrl', function() {
        var searchCtrl;
        beforeEach(inject(function($controller) {
            scope.servicename = 'Products';
            spyOn(scope, '$watch').and.callThrough();
            searchCtrl = $controller('ordercloudSearchCtrl', {
                $scope: scope
            });
            scope.$digest();
        }));
        it('should initialize the placeholder for the search', function() {
            expect(scope.placeholder).toBe('Search Products...')
        });
        it('should initialize the search term to null', function() {
            expect(scope.searchTerm).toBe(null);
        });
        it('should trigger the watch function when searchTerm is changed', function() {
            scope.searchTerm = 'potato';
            scope.$digest();
            expect(scope.$watch).toHaveBeenCalled();
        });
    });
    describe('Factory: TrackSearch', function() {
        var trackSearch;
        beforeEach(inject(function(TrackSearch) {
            trackSearch = TrackSearch;
        }));
        it('should initialize term to null', function() {
            expect(trackSearch.GetTerm()).toBe(null);
        });
        it('SetTerm should change the value of term', function() {
            trackSearch.SetTerm('testing');
            expect(trackSearch.GetTerm()).toBe('testing');
        });
    });
});