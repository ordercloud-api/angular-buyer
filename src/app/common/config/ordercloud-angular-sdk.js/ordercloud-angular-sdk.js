angular.module('orderCloud')
    .run(OrderCloudAngularSDKConfig)
;

function OrderCloudAngularSDKConfig(OrderCloudSDK, appname, apiurl, authurl) {
    var cookiePrefix = appname.replace(/ /g, '_').toLowerCase();
    var apiVersion = 'v1';
    OrderCloudSDK.Config(cookiePrefix, apiurl + '/' + apiVersion, authurl);
}