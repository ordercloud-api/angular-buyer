angular.module('orderCloud')
    .directive('ocPayment', OrderCloudPaymentDirective)
    .controller('ocPaymentCtrl', OrderCloudPaymentController)
;

function OrderCloudPaymentDirective() {
    return {
        scope: {
            allowMultiple: '=?multiple',
            methods: '=?',
            order: '='
        },
        templateUrl: 'common/directives/oc-payment/oc-payment.html',
        controller: 'ocPaymentCtrl',
        controllerAs: 'ocPayment',
        bindToController: true
    };
}

function OrderCloudPaymentController($filter, toastr, OrderCloudSDK, CheckoutConfig, ocPayment, ocMyCreditCards) {
    var vm = this;
    vm.$onInit = _initialize;
    vm.$doCheck = _onChanges;

    vm.paymentTypeChanged = _paymentTypeChanged;
    vm.changePaymentAccount = _changePaymentAccount;

    vm.createNewCreditCard = _createNewCreditCard;
    vm.updatePONumber = _updatePONumber;

    vm.addPayment = _addPayment;
    vm.removePayment = _removePayment;
    vm.updatePaymentAmount = _updatePaymentAmount;

    function _initialize() {
        if (!vm.allowMultiple) vm.allowMultiple = CheckoutConfig.AllowMultiplePayments;
        if (!vm.methods) vm.methods = CheckoutConfig.AvailablePaymentMethods;
        vm.loading = ocPayment.Init(vm.order, vm.methods[0])
            .then(function(payments) {
                vm.payments = payments;
            });
    }
    
    function _onChanges() {
        if (vm.payments) vm.canAddPayment = ocPayment.CalculateMaxTotal(vm.order, vm.payments);
        if (vm.form) vm.form.$setValidity('PaidInFull', !vm.canAddPayment);
    }

    function _paymentTypeChanged(scope) {
		if (scope.payment.Type === 'CreditCard' || scope.payment.Type === 'SpendingAccount') {
            vm.selectingAccount = true;
			scope.payment.loading = ocPayment.SelectPaymentAccount(scope.payment, vm.order)
				.then(function(payment) {
					vm.payments[scope.$index] = payment;
                    vm.selectingAccount = false;
				})
                .catch(function(ex) {
                    if (ex === 'CREATE_NEW_CC') {
                        vm.createNewCreditCard(scope.$index);
                    } else {
                        vm.selectingAccount = false;
                    }
                });
		} else {
            vm.loading = ocPayment.Save(scope.payment, vm.order)
                .then(function(newPayment) {
                    vm.payments[scope.$index] = newPayment;
                });
        }
	}
    
    function _changePaymentAccount(scope) {
        scope.payment.loading = ocPayment.SelectPaymentAccount(scope.payment, vm.order)
			.then(function(payment) {
                vm.payments[scope.$index] = payment;
			})
			.catch(function(ex) {
				if (ex === 'CREATE_NEW_CC') {
					vm.createNewCreditCard(scope.$index);
				}
			});
    }
    
    function _createNewCreditCard(paymentIndex) {
        ocMyCreditCards.Create()
            .then(function(card) {
                vm.payments[paymentIndex].CreditCardID = card.ID;
                vm.payments[paymentIndex].loading = ocPayment.Save(vm.payments[paymentIndex], vm.order, card)
                    .then(function(newPayment) {
                        toastr.success('Credit card ending in ' + card.PartialAccountNumber + ' was saved.');
                        newPayment.CreditCard = card;
                        vm.payments[paymentIndex] = newPayment;
                        vm.selectingAccount = false;
                    });
            });
    }
    
    function _updatePONumber(scope) {
        if (scope.payment.xp.PONumber === '') scope.payment.xp.PONumber = null;
        scope.payment.loading = OrderCloudSDK.Payments.Patch('outgoing', vm.order.ID, scope.payment.ID, _.pick(scope.payment, 'xp'))
            .then(function() {
                toastr.success('PO Number was updated.');
            });
    }
    
    function _addPayment() {
        vm.loading = ocPayment.AddPayment(vm.order, vm.methods[0], vm.payments)
            .then(function(updatedPayments) {
                vm.payments = updatedPayments;
            });
    }

    function _removePayment(scope) {
        if (!scope.payment.ID) {
            _splicePayment();
        } else {
            scope.payment.loading = OrderCloudSDK.Payments.Delete('outgoing', vm.order.ID, scope.payment.ID)
                .then(function(){
                    _splicePayment();
                });
        }
        function _splicePayment() {
            vm.payments.splice(scope.$index, 1);
            toastr.success('Payment removed.');
        }
    }

    function _updatePaymentAmount(scope) {
		if (scope.payment.Amount > scope.payment.MaxAmount || !scope.payment.Amount) return;
		scope.payment.loading = OrderCloudSDK.Payments.Patch('outgoing', vm.order.ID, scope.payment.ID, _.pick(scope.payment, 'Amount'))
			.then(function() {
				toastr.success('Payment amount updated to ' + $filter('currency')(scope.payment.Amount));
			});
	}
}