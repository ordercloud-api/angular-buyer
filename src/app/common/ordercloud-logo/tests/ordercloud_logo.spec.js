describe('Directive: ordercloudLogo', function() {
    var scope,
        element,
        blank_element;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));
    it ('should initialize all values passed in as attributes', inject(function($compile) {
        element = $compile('<ordercloud-logo icon="true" color="blue" height="30" width="31"></ordercloud-logo>')(scope);
        scope.$digest();
        expect(element.scope().OrderCloudLogo).not.toBe(undefined);
        expect(element.scope().OrderCloudLogo.Icon).toBe(true);
        expect(element.scope().OrderCloudLogo.maxHeight).toBe('30');
        expect(element.scope().OrderCloudLogo.width).toBe('31');
        expect(element.scope().OrderCloudLogo.fillColor).toBe('blue');
    }));
    it ('should set logo to false if not passed in and all other values to undefined', inject(function($compile) {
        blank_element = $compile('<ordercloud-logo></ordercloud-logo>')(scope);
        scope.$digest();
        expect(blank_element.scope().OrderCloudLogo).not.toBe(undefined);
        expect(blank_element.scope().OrderCloudLogo.Icon).toBe(false);
        expect(blank_element.scope().OrderCloudLogo.maxHeight).toBe(undefined);
        expect(blank_element.scope().OrderCloudLogo.width).toBe(undefined);
        expect(blank_element.scope().OrderCloudLogo.fillColor).toBe(undefined);
    }));
});