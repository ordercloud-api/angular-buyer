angular.module('orderCloud')
    .factory('ocFileReader', OrderCloudFileReader)
;

function OrderCloudFileReader($q) {
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