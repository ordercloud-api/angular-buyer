angular.module('orderCloud')
    .factory('ocPayment', OrderCloudPaymentService);

function OrderCloudPaymentService($rootScope, $q, $uibModal, $exceptionHandler, OrderCloudSDK) {
    var service = {
        Init: _init,
        AddPayment: _addPayment,
        CalculateMaxTotal: _calculateMaxTotal,
        PaymentsExceedTotal: _paymentsExceedTotal,
        RemoveAllPayments: _removeAllPayments,
        SelectPaymentAccount: _selectPaymentAccount,
        Save: _save
    };

    function _init(order, paymentType) {
        var df = $q.defer();
        OrderCloudSDK.Payments.List('outgoing', order.ID)
			.then(function(data) {
                if (_paymentsExceedTotal(data.Items, order.Total) || (data.Items.length === 1 && _calculateMaxTotal(order, data.Items))) {
                    _removeAllPayments(data, order)
                        .then(function() {
                            df.resolve(_addPayment(order, paymentType));
                        });
                } else if (data.Items.length) {
                    df.resolve(_getPaymentDetails(data.Items));
                } else {
                    df.resolve(_addPayment(order, paymentType));
                }
			});

        function _getPaymentDetails(payments) {
            var defer = $q.defer();
            var queue = [];

            angular.forEach(payments, function(payment) {
                if (payment.CreditCardID) {
                    queue.push(_getCreditCardDetails(payment));
                } else if (payment.SpendingAccountID) {
                    queue.push(_getSpendingAccountDetails(payment));
                } else {
                    queue.push(_addPurchaseOrderPayment(payment));
                }
            });

            queue.length ? df.resolve($q.all(queue)) : df.resolve(payments);

            function _getCreditCardDetails(p) {
                var deferred = $q.defer();
                OrderCloudSDK.Me.GetCreditCard(p.CreditCardID)
                    .then(function(data) {
                        p.CreditCard = data;
                        deferred.resolve(p);
                    });
                return deferred.promise;
            }

            function _getSpendingAccountDetails(p) {
                var deferred = $q.defer();
                OrderCloudSDK.Me.GetSpendingAccount(p.SpendingAccountID)
                    .then(function(data) {
                        p.SpendingAccount = data;
                        deferred.resolve(p);
                    });
                return deferred.promise;
            }

            function _addPurchaseOrderPayment(p) {
                var deferred = $q.defer();
                deferred.resolve(p);
                return deferred.promise;
            }

            return defer.promise;
        }

        return df.promise;
    }

    function _addPayment(order, paymentType, currentPayments) {
        var df = $q.defer();
        var paymentTotal = currentPayments ? order.Total - _.reduce(currentPayments, function(sum, payment) { return payment.Amount + sum; }, 0) : order.Total;
		var payment = {
			Type: paymentType,
			DateCreated: new Date().toISOString(),
			Amount: paymentTotal
		};
        if (paymentType === 'PurchaseOrder') {
            OrderCloudSDK.Payments.Create('outgoing', order.ID, payment)
                .then(function(newPayment) {
                    var payments = currentPayments ? currentPayments.concat([newPayment]) : [newPayment];
                    df.resolve(payments);
                });
        } else {
            var payments = currentPayments ? currentPayments.concat([payment]) : [payment];
            df.resolve(payments);
        }

        return df.promise;
    }

    function _calculateMaxTotal(order, payments) {
        var paymentTotal = 0;
		angular.forEach(payments, function(payment) {
			paymentTotal += payment.Amount;
			var maxAmount = order.Total - _.reduce(_.pluck(payments, 'Amount'), function(a, b) {return a + b; });
			payment.MaxAmount = (payment.Amount + maxAmount).toFixed(2);
		});
        return paymentTotal < order.Total;
    }

    function _paymentsExceedTotal(payments, orderTotal) {
        var paymentTotal = 0;
        angular.forEach(payments.Items, function (payment) {
            paymentTotal += payment.Amount;
        });

        return paymentTotal.toFixed(2) > orderTotal;
    }

    function _removeAllPayments(payments, order) {
        var deferred = $q.defer();

        var queue = [];
        angular.forEach(payments.Items, function (payment) {
            queue.push(OrderCloudSDK.Payments.Delete('outgoing', order.ID, payment.ID));
        });

        $q.all(queue).then(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    function _selectPaymentAccount(payment, order) {
        return $uibModal.open({
            templateUrl: 'common/directives/oc-payment/selectPaymentAccount.modal.html',
            controller: 'SelectPaymentAccountModalCtrl',
            controllerAs: 'selectPaymentAccount',
            size: 'md',
            resolve: {
                Accounts: function (OrderCloudSDK) {
                    var options = {
                        page: 1,
                        pageSize: 100
                    };
                    if (payment.Type === 'SpendingAccount') {
                        options.filters = {
                            RedemptionCode: '!*',
                            AllowAsPaymentMethod: true
                        };
                        return OrderCloudSDK.Me.ListSpendingAccounts(options);
                    } else {
                        return OrderCloudSDK.Me.ListCreditCards(options);
                    }
                },
                Payment: function () {
                    return payment;
                },
                Order: function () {
                    return order;
                }
            }
        }).result;
    }

    function _save(payment, order, account) {
        var df = $q.defer();

        if (payment.ID) {
            OrderCloudSDK.Payments.Delete('outgoing', order.ID, payment.ID)
                .then(function () {
                    delete payment.ID;
                    createPayment(payment);
                });
        } else {
            createPayment(payment);
        }

        function createPayment(newPayment) {
            var paymentRequestBody;
            switch (newPayment.Type) {
                case 'PurchaseOrder':
                    paymentRequestBody = _.pick(newPayment, 'Type', 'Amount', 'DateCreated');
                    break;
                case 'CreditCard': {
                    paymentRequestBody = _.pick(newPayment, 'Type', 'Amount', 'DateCreated', 'CreditCardID');
                    break;
                }
                case 'SpendingAccount': {
                    paymentRequestBody = _.pick(newPayment, 'Type', 'Amount', 'DateCreated', 'SpendingAccountID');
                    break;
                }
            }
            OrderCloudSDK.Payments.Create('outgoing', order.ID, paymentRequestBody)
                .then(function (data) {
                    if (data.SpendingAccountID) data.SpendingAccount = account;
                    if (data.CreditCardID) data.CreditCard = account;
                    $rootScope.$broadcast('OCPaymentUpdated', data);
                    df.resolve(data);
                })
                .catch(function(ex) {
                    $exceptionHandler(ex);
                })
        }

        return df.promise;
    }

    return service;
}