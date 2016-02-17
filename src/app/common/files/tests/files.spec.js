describe('Component: Files', function() {
    var scope;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));
    describe('Factory: FileReader', function() {
        var fileReader;
        beforeEach(inject(function(FileReader) {
            fileReader = FileReader;
        }));
    });
    describe('Factory: FileService', function() {
        var fileService;
        beforeEach(inject(function(FileService) {
            fileService = FileService;
        }));
    });
    xdescribe('Directive: ordercloudFileUpload', function() {
        var element;
        beforeEach(inject(function($compile) {
            scope.model = {};
            element = $compile('<ordercloud-file-upload model="model" keyname="text_files" label="label_for_field"></ordercloud-file-upload>')(scope);
            scope.$digest();
        }));
        it('should initialize the values into the isolated scope', function() {
            expect(element.isolateScope().model).toEqual({});
            expect(element.isolateScope().keyname).toBe('text_files');
            expect(element.isolateScope().label).toBe('label_for_field');
        });
    });
});