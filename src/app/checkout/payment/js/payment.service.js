angular.module('orderCloud')
    .factory('ocCheckoutPaymentService', OrderCloudCheckoutPaymentService)
;

function OrderCloudCheckoutPaymentService($q, sdkOrderCloud) {
    var service = {
        PaymentsExceedTotal: _paymentsExceedTotal,
        RemoveAllPayments: _removeAllPayments
    };

    function _paymentsExceedTotal(payments, orderTotal) {
        var paymentTotal = 0;
        angular.forEach(payments.Items, function(payment) {
            paymentTotal += payment.Amount;
        });

        return paymentTotal.toFixed(2) > orderTotal;
    }

    function _removeAllPayments(payments, order) {
        var deferred = $q.defer();

        var queue = [];
        angular.forEach(payments.Items, function(payment) {
            queue.push(sdkOrderCloud.Payments.Delete('outgoing', order.ID, payment.ID));
        });

        $q.all(queue).then(function() {
            deferred.resolve();
        });

        return deferred.promise;
    }

    return service;
}