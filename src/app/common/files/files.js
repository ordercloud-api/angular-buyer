angular.module('orderCloud')
    .factory('FileReader', fileReader)
    .factory('FilesService', FilesService)
    .directive('ordercloudFileUpload', ordercloudFileUpload)
;

//TODO: update the New SDK to have a file Upload method similar to how this works.  Minus attaching the file info to any XP
function fileReader($q) {
    var service = {
        ReadAsDataUrl: _readAsDataURL
    };

    function onLoad(reader, deferred, scope) {
        return function() {
            scope.$apply(function() {
                deferred.resolve(reader);
            });
        };
    }

    function onError(reader, deferred, scope) {
        return function() {
            scope.$apply(function() {
                deferred.reject(reader);
            });
        };
    }

    function onProgress(reader, scope) {
        return function(event) {
            scope.$broadcast('fileProgress',
                {
                    total: event.total,
                    loaded: event.loaded
                });
        };
    }

    function getReader(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    }

    function _readAsDataURL(file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    }

    return service;
}

function FilesService($q, $http, OrderCloud, apiurl) {
    var service = {
        Upload: _upload
    };

    var fileURL = apiurl + '/v1/files';

    function _upload(file, fileName) {
        var deferred = $q.defer();

        var fd = new FormData();
        fd.append('file', file);

        $http.post(fileURL + '?filename=' + fileName, fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined, 'Authorization': 'Bearer ' + OrderCloud.Auth.ReadToken()}})
            .success(function(data) {
                deferred.resolve(data);
            })
            .error(function(error) {
                deferred.reject(error)
            });

        return deferred.promise;
    }

    return service;
}

function ordercloudFileUpload($parse, Underscore, FileReader, FilesService) {
    var directive = {
        scope: {
            model: '=',
            keyname: '@',
            label: '@',
            extensions: '@',
            invalidExtension: '@'
        },
        restrict: 'E',
        templateUrl: 'common/files/templates/files.tpl.html',
        replace: true,
        link: link
    };

    function link(scope, element, attrs) {
        var file_input = $parse('file');
        var file_control = angular.element(element.find('input'))[0];
        var el = element;
        scope.invalidExtension = false;

        scope.upload = function() {
            $('#orderCloudUpload').click();
        };

        scope.remove = function() {
            delete scope.model.xp[scope.keyname];
        };

        function afterSelection(file, fileName) {
            FilesService.Upload(file, fileName)
                .then(function(fileData) {
                    if (!scope.model.xp) scope.model.xp = {};
                    scope.model.xp[scope.keyname] = fileData;
                    scope.model.xp[scope.keyname].Type = file.type;
                });
        }

        var allowed = {
            Extensions: [],
            Types: []
        };
        if (scope.extensions) {
            var items = Underscore.map(scope.extensions.split(','), function(ext) { return ext.replace(/ /g ,'').replace(/\./g, '').toLowerCase() });
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
                        scope.invalidExtension = false;
                        scope.$apply(function() {
                            FileReader.ReadAsDataUrl(event.target.files[0], scope)
                                .then(function(f) {
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
                            if (!scope.model.xp) scope.model.xp = {};
                            scope.model.xp[scope.keyname] = null;
                        });
                    }
                    break;
            }
        }

        element.bind('change', updateModel);
    }

    return directive;
}

