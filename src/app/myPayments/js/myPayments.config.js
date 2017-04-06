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
                pageTitle: "Payment Methods"
            },
            resolve: {
                UserCreditCards: function(sdkOrderCloud) {
                    var options = {
                        filters: {Editable: true}
                    };
                    return sdkOrderCloud.Me.ListCreditCards(options);
                },
                UserSpendingAccounts: function(sdkOrderCloud) {
                    var options = {
                        filters: {RedemptionCode: '!*'}
                    };
                   return sdkOrderCloud.Me.ListSpendingAccounts(options);
                },
                GiftCards: function(sdkOrderCloud) {
                    var options = {
                        filters: {RedemptionCode: '*'}
                    };
                    return sdkOrderCloud.Me.ListSpendingAccounts(options);
                }
            }
        });
}