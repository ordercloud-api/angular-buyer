angular.module('orderCloud')
    .factory('ocSpendingCredit', ocSpendingCreditService)
;

function ocSpendingCreditService(OrderCloudSDK, buyerid) {
    var service = {
        Update: _updateAccountBalance
    }

    function _updateAccountBalance(order) {
        return OrderCloudSDK.Me.ListSpendingAccounts()
            .then(function(account) {
                var newBalance = account.Balance + (order.Total * .05);
                return OrderCloud.SpendingAccounts.Patch(buyerid, account.ID, {Balance: newBalance});
            })
    }
    return service;
}