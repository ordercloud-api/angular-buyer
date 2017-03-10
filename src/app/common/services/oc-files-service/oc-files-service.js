// AWS S3 file upload service. If another service is needed, manage within this module. Maintain the factory name so that the directive will continue to function without change
// it is simply required to maintain an "Upload" function. In this module Get and Delete were created as possible capabilities but not implemented within the file upload directive
// for this implementation the s3 keys are stored here in this service. Consideration of securing those credentials should be take for future usage

angular.module('orderCloud')
    .factory('ocFilesService', OrderCloudFilesService)
;

function OrderCloudFilesService($q) {
    var service = {
        Get: _get,
        Upload: _upload,
        Delete: _delete
    };

    AWS.config.region = 'us-west-2';
    AWS.config.update({ accessKeyId: 'AKIAJDDM5ZWWOIH4AZZQ', secretAccessKey: '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' });

    function randomString() {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var string_length = 15;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        return randomstring;
    }

    function _get(fileKey) {
        var deferred = $q.defer();
        var s3 = new AWS.S3();
        var params = {Bucket: 'marketplace-application-test', Key: fileKey};
        s3.getObject(params, function (err, data) {
            err ? console.log(err) : console.log(data);
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    function _upload(file) {
        var deferred = $q.defer();
        var s3 = new AWS.S3();
        var params = {Bucket: 'marketplace-application-test', Key: randomString(), ContentType: file.type, Body: file};
        s3.upload(params, function (err, data) {
            err ? console.log(err) : console.log(data);
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    function _delete(fileKey) {
        var deferred = $q.defer();
        var s3 = new AWS.S3();
        var params = {Bucket: 'marketplace-application-test', Key: fileKey};
        s3.deleteObject(params, function (err, data) {
            err ? console.log(err) : console.log(data);
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    return service;
}
