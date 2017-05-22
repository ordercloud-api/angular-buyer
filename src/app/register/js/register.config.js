angular.module('orderCloud')
    .config(RegisterConfig)
;

function RegisterConfig($stateProvider) {
    $stateProvider
        .state('register', {
            url: '/register',
            templateUrl: 'register/templates/register.html',
            controller: 'RegisterCtrl',
            controllerAs: 'register',
            resolve: {
                IsAnonymous: function($q, OrderCloudSDK, anonymous) {
                    var df = $q.defer();
                    if (!anonymous) {
                        df.reject('Registration is not available for this store.');
                    } else if (!angular.isDefined(JSON.parse(atob(OrderCloudSDK.GetToken().split('.')[1])).orderid)) {
                        df.reject('You are already logged in.');
                    } else {
                        df.resolve();
                    }
                    return df.promise;
                }
            }
        });
}