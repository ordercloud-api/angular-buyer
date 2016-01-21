describe('Directive: ordercloudAutoId', function() {
    var scope,
        element,
        modelValue;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module('ordercloud-auto-id'));
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        element = $compile('<div><input class="element_for_testing" ordercloud-auto-id boxtext="boxtext" ng-model="modelValue"></div>')(scope);
        scope.$digest();
    }));
    it('should set boxtext to the value passed in', inject(function($compile) {
        var potato_element = $compile('<input ordercloud-auto-id boxtext="potato" ng-model="modelValue">')(scope);
        scope.$digest();
        expect(potato_element.isolateScope().boxtext).toBe('potato');
    }));
    it('should wrap the input in an input group div', function() {
        var result = element[0].querySelectorAll('.input-group');
        expect(angular.element(result).hasClass('input-group')).toBe(true);
    });
    it('should have property checked set to checked', function() {
        var result = element[0].querySelectorAll('.input-group-addon');
        expect(angular.element(result).attr('checked')).toBe('checked');
    });
    it('should have attribute disabled set to disabled', function() {
        var result = element[0].querySelectorAll('.element_for_testing');
        expect(angular.element(result).attr('disabled')).toBe('disabled');
    });
    it('should init boxtext if no value is passed in', inject(function($compile) {
        var blank_element = $compile('<input ordercloud-auto-id ng-model="modelValue">')(scope);
        scope.$digest();
        expect(blank_element.isolateScope().boxtext).toBe('Auto-Gen. ID');
    }));
});
