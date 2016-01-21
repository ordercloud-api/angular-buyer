describe('Component: Infinite Scroll', function() {
    var scope;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module('ordercloud-infinite-scroll'))
    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));
    describe('Directive: ordercloudInfiniteScroll', function() {
        var element;
        beforeEach(inject(function($compile, Paging) {
            scope.ctrl = {};
            element = $compile('<div ordercloud-infinite-scroll class="table-container" servicename="Products" controlleras="ctrl"></div>')(scope);
            spyOn(Paging, 'paging').and.returnValue(true);
        }));
        it ('should initialize the directive', function() {
            expect(element.isolateScope().controlleras).toEqual({});
            expect(element.isolateScope().servicename).toBe('Products');
        });
    });
    describe('Controller: InfiniteScrollCtrl', function() {
        var infiniteScrollCtrl;
        beforeEach(inject(function($controller, TrackSearch) {
            spyOn(TrackSearch, 'SetTerm').and.callThrough();
            infiniteScrollCtrl = $controller('InfiniteScrollCtrl', {
                $scope: scope
            });
        }));
        it('should initialize the search term to null', inject(function(TrackSearch) {
            expect(TrackSearch.SetTerm).toHaveBeenCalledWith(null);
        }));
    });
});