angular.module('orderCloud')
    .config(MyPaymentsConfig)
;

function MyPaymentsConfig($stateProvider) {
    $stateProvider
        .state('myPayments', {
            parent: 'account',
            url: '/payments',
            templateUrl: 'myPayments/templates/myPayments.html',
            controller: 'MyPaymentsCtrl',
            controllerAs: 'myPayments',
            data: {
                pageTitle: 'Payment Methods'
            },
            resolve: {
                UserCreditCards: function(OrderCloudSDK) {
                    var options = {
                        filters: {Editable: true}
                    };
                    return OrderCloudSDK.Me.ListCreditCards(options);
                },
                UserSpendingAccounts: function(OrderCloudSDK) {
                    var options = {
                        filters: {RedemptionCode: '!*'}
                    };
                   return OrderCloudSDK.Me.ListSpendingAccounts(options);
                },
                GiftCards: function(OrderCloudSDK) {
                    var options = {
                        filters: {RedemptionCode: '*'}
                    };
                    return OrderCloudSDK.Me.ListSpendingAccounts(options);
                }
            }
        });
}