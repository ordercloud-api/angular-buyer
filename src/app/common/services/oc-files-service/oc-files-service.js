// AWS S3 file upload service. If another service is needed, manage within this module. Maintain the factory name so that the directive will continue to function without change
// it is simply required to maintain an "Upload" function. In this module Get and Delete were created as possible capabilities but not implemented within the file upload directive

angular.module('orderCloud')
    .factory('ocFilesService', OrderCloudFilesService)
;

function OrderCloudFilesService($q, awsaccesskeyid, awssecretaccesskey, awsregion, awsbucket) {
    var service = {
        Get: _get,
        Upload: _upload,
        Delete: _delete
    };

    AWS.config.region = awsregion;
    AWS.config.update({ accessKeyId: awsaccesskeyid, secretAccessKey: awssecretaccesskey });

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
        var params = {Bucket: awsbucket, Key: fileKey};
        s3.getObject(params, function (err, data) {
            err ? console.log(err) : console.log(data);
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    function _upload(file, folder) {
        var deferred = $q.defer();
        var s3 = new AWS.S3();
        var key = (folder ? folder + '/' : '') + randomString();
        var params = {Bucket: awsbucket, Key: key, ContentType: file.type, Body: file};
        s3.upload(params, function (err, data) {
            err ? console.log(err) : console.log(data);
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    function _delete(fileKey) {
        var deferred = $q.defer();
        var s3 = new AWS.S3();
        var params = {Bucket: awsbucket, Key: fileKey};
        s3.deleteObject(params, function (err, data) {
            err ? console.log(err) : console.log(data);
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    return service;
}
