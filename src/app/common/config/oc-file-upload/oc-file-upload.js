angular.module('orderCloud')
    .config(function($provide, $injector) {
        var awsaccesskeyid = $injector.has('awsaccesskeyid') ? $injector.get('awsaccesskeyid') : null;
        var awssecretaccesskey = $injector.has('awssecretaccesskey') ? $injector.get('awssecretaccesskey') : null;
        var awsregion = $injector.has('awsregion') ? $injector.get('awsregion') : null;
        var awsbucket = $injector.has('awsbucket') ? $injector.get('awsbucket') : null;

        $provide.value('awsaccesskeyid', awsaccesskeyid || 'XXXXXXXXXXXXXXXXXXXX');
        $provide.value('awssecretaccesskey', awssecretaccesskey || 'XXXXXXXXXXXXXXXXX+XXXXXXXXXXXXXXXXXXXXXX');
        $provide.value('awsregion', awsregion || 'XX-XXXX-X');
        $provide.value('awsbucket', awsbucket || 'XXXX');
    })
;