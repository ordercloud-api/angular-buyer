angular.module('orderCloud')
    .directive('ocFileUpload', ordercloudFileUpload)
;

function ordercloudFileUpload($parse, ocFileReader, ocFilesService) {
    //TODO: accept keyName param for choosing which xp[{key}] the image URL will save to
    var directive = {
        scope: {
            model: '=',
            extensions: '@',
            invalidExtension: '@',
            patch: '&'
        },
        restrict: 'E',
        templateUrl: 'common/directives/oc-file-upload/oc-file-upload.html',
        replace: true,
        link: link
    };

    function link(scope, element, attrs) {
        var file_input = $parse('file');
        var el = element;
        scope.invalidExtension = false;

        scope.upload = function() {
            $('#orderCloudUpload').click();
        };

        scope.remove = function() {
            delete scope.model.xp.image.URL;
        };

        function afterSelection(file, fileName) {
            ocFilesService.Upload(file, fileName)
                .then(function(fileData) {
                    if (!scope.model.xp) scope.model.xp = {};
                    scope.model.xp.image = {};
                    scope.model.xp.image.URL = fileData.Location;
                    if (scope.patch) scope.patch({xp: scope.model.xp});
                });
        }

        var allowed = {
            Extensions: [],
            Types: []
        };
        if (scope.extensions) {
            var items = _.map(scope.extensions.split(','), function(ext) {
                return ext.replace(/ /g ,'').replace(/\./g, '').toLowerCase();
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
                    if (valid) {
                        scope.$apply(function() {
                            ocFileReader.ReadAsDataUrl(event.target.files[0], scope)
                                .then(function() {
                                    afterSelection(event.target.files[0], fileName);
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
                            if (!scope.model.xp.image) scope.model.xp.image = {};
                            scope.model.xp.image.URL = null;
                        });
                    }
                    break;
            }
        }

        element.bind('change', updateModel);
    }

    return directive;
}

