angular.module('orderCloud')
    .directive('ocFileUpload', ordercloudFileUpload)
;

function ordercloudFileUpload($parse, ocFileReader, ocFilesService) {
    var directive = {
        scope: {
            fileUploadObject: '=',
            fileUploadOptions: '='
        },
        restrict: 'E',
        templateUrl: 'common/directives/oc-file-upload/oc-file-upload.html',
        replace: true,
        link: link
    };

    function link(scope, element, attrs, formCtrl) {
        var file_input = $parse('file');
        var el = element;
        scope.invalidExtension = false;

        if (!scope.fileUploadOptions) {
            scope.fileUploadOptions = {
                keyname: null,
                folder: null,
                extensions: null,
                invalidExtensions: null,
                uploadText: null,
                onUpdate: null
            };
        }

        scope.upload = function() {
            $('#orderCloudUpload').click();
        };

        scope.remove = function() {
            scope.invalidExtension = false;
            if (scope.fileUploadObject.xp && scope.fileUploadObject.xp[scope.fileUploadOptions.keyname || 'image']) scope.fileUploadObject.xp[scope.fileUploadOptions.keyname || 'image'] = null;
            if (scope.fileUploadOptions.onUpdate && (typeof scope.fileUploadOptions.onUpdate == 'function')) scope.fileUploadOptions.onUpdate(scope.fileUploadObject.xp);
        };

        function afterSelection(file, folder) {
            ocFilesService.Upload(file, folder)
                .then(function(fileData) {
                    if (!scope.fileUploadObject.xp) scope.fileUploadObject.xp = {};
                    scope.fileUploadObject.xp[scope.fileUploadOptions.keyname || 'image'] = {};
                    scope.fileUploadObject.xp[scope.fileUploadOptions.keyname || 'image'].URL = fileData.Location;
                    if (scope.fileUploadOptions.onUpdate && (typeof scope.fileUploadOptions.onUpdate == 'function')) scope.fileUploadOptions.onUpdate(scope.fileUploadObject.xp);
                });
        }

        var allowed = {
            Extensions: [],
            Types: []
        };
        if (scope.fileUploadOptions.extensions) {
            var items = _.map(scope.fileUploadOptions.extensions.split(','), function(ext) {
                return ext.replace(/ /g, '').replace(/\./g, '').toLowerCase();
            });
            angular.forEach(items, function(item) {
                if (item.indexOf('/') > -1) {
                    if (item.indexOf('*') > -1) {
                        allowed.Types.push(item.split('/')[0]);
                    }
                    else {
                        allowed.Extensions.push(item.split('/')[1]);
                    }
                }
                else {
                    allowed.Extensions.push(item);
                }
            });
        }

        var notAllowed = {
            Extensions: [],
            Types: []
        };
        if (scope.fileUploadOptions.invalidExtensions) {
            var items = _.map(scope.fileUploadOptions.invalidExtensions.split(','), function(ext) {
                return ext.replace(/ /g, '').replace(/\./g, '').toLowerCase();
            });
            angular.forEach(items, function(item) {
                if (item.indexOf('/') > -1) {
                    if (item.indexOf('*') > -1) {
                        notAllowed.Types.push(item.split('/')[0]);
                    }
                    else {
                        notAllowed.Extensions.push(item.split('/')[1]);
                    }
                }
                else {
                    notAllowed.Extensions.push(item);
                }
            });
        }

        function updateModel(event) {
            switch (event.target.name) {
                case 'upload':
                    if (event.target.files[0] == null) return;
                    var fileName = event.target.files[0].name;
                    var valid = true;
                    if ((allowed.Extensions.length || allowed.Types.length) && fileName) {
                        var ext = fileName.split('.').pop().toLowerCase();
                        valid = (allowed.Extensions.indexOf(ext) != -1 || allowed.Types.indexOf(event.target.files[0].type.split('/')[0]) > -1);
                    }
                    if ((notAllowed.Extensions.length || notAllowed.Types.length) && fileName) {
                        var ext = fileName.split('.').pop().toLowerCase();
                        valid = (notAllowed.Extensions.indexOf(ext) == -1 && notAllowed.Types.indexOf(event.target.files[0].type.split('/')[0]) == -1);
                    }
                    if (valid) {
                        scope.invalidExtension = false;
                        scope.$apply(function() {
                            ocFileReader.ReadAsDataUrl(event.target.files[0], scope)
                                .then(function() {
                                    afterSelection(event.target.files[0], scope.fileUploadOptions.folder);
                                });
                            file_input.assign(scope, event.target.files[0]);
                        });
                    }
                    else {
                        scope.$apply(function() {
                            scope.invalidExtension = true;
                            var input;
                            event.target.files[0] = null;
                            el.find('input').replaceWith(input = el.find('input').clone(true));
                            if (scope.fileUploadObject.xp && scope.fileUploadObject.xp[scope.fileUploadOptions.keyname || 'image']) scope.fileUploadObject.xp[scope.fileUploadOptions.keyname || 'image'] = null;
                        });
                    }
                    break;
            }
        }

        element.bind('change', updateModel);
    }

    return directive;
}

