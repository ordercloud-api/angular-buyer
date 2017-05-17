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
                var accountData =  account.Items[0];
                var newBalance = accountData.Balance + (order.Total * .05);
                return OrderCloudSDK.SpendingAccounts.Patch(buyerid, accountData.ID, {Balance: newBalance});
            })
    }
    return service;
}