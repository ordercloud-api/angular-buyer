describe('Payment Directives', function() {
	var oc,
		q,
		scope,
		rootScope;
	beforeEach(module('orderCloud'));
	beforeEach(module('orderCloud.sdk'));
	beforeEach(inject(function($q, $rootScope, OrderCloud) {
		oc = OrderCloud;
		q = $q;
		scope = $rootScope.$new();
		rootScope = $rootScope;
	}));

	describe('Controller: PaymentPurchaseOrderCtrl', function() {
		var paymentPOCtrl,
			order = {ID:'ORDER_ID'},
			payment = {ID:'PAYMENT_ID', Type:'OtherPaymentType'},
			controller;

		beforeEach(inject(function($controller) {
			controller = $controller;
		}));

		describe('Initalize payment details', function() {
			describe('When a payment is not passed through', function() {
				beforeEach(function() {
					scope.payment = undefined;
					scope.order = order;
				});
				it ('should list payments', function() {
					spyOn(oc.Payments, 'List').and.callThrough();
					paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
						$scope: scope
					});
					expect(oc.Payments.List).toHaveBeenCalledWith(order.ID);
				});
				it ('should update the first existing payment to a purchase order', function() {
					var existingpayments = q.defer();
					existingpayments.resolve({Items: [{ID: 'EXISTING_PAYMENT_ID'}]});
					spyOn(oc.Payments, 'List').and.returnValue(existingpayments.promise);

					var df = q.defer();
					df.resolve('UPDATED_PAYMENT');
					spyOn(oc.Payments, 'Patch').and.returnValue(df.resolve);

					paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
						$scope: scope
					});
					scope.$digest();
					expect(oc.Payments.Patch).toHaveBeenCalledWith(order.ID, 'EXISTING_PAYMENT_ID', {
						Type: "PurchaseOrder",
						CreditCardID: null,
						SpendingAccountID: null,
						Amount: null
					});
				});
				it ('should create a new payment if one does not exist', function() {
					var nopayments = q.defer();
					nopayments.resolve({Items:[]});
					spyOn(oc.Payments, 'List').and.returnValue(nopayments.promise);

					var df = q.defer();
					df.resolve("NEW_PAYMENT");
					spyOn(oc.Payments, 'Create').and.returnValue(df.resolve);

					paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
						$scope: scope
					});
					scope.$digest();
					expect(oc.Payments.Create).toHaveBeenCalledWith(order.ID, {Type: "PurchaseOrder"});
					//scope.$digest(); TODO: make this expect statement work
					//expect(paymentPOCtrl.payment).toBe("NEW_PAYMENT");
				})
			});
			describe('When a payment is passed through', function() {
				it ('should update payment to a purchase order', function() {
					scope.payment = payment;
					scope.order = order;

					var defer = q.defer();
					defer.resolve('UPDATED_PAYMENT');
					spyOn(oc.Payments, 'Patch').and.returnValue(defer.promise);

					paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
						$scope: scope
					});

					expect(oc.Payments.Patch).toHaveBeenCalledWith(order.ID, payment.ID, {
						ID: payment.ID,
						SpendingAccountID:null,
						CreditCardID:null,
						Type:"PurchaseOrder"
					});
				});
			});
		});

		describe('$scope.updatePayment()', function() {
			it ('Should patch the current payment to a purchase order', function() {
				scope.payment = payment;
				scope.order = order;
				paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
					$scope: scope
				});
				var updatedpayment = q.defer();
				updatedpayment.resolve();
				spyOn(oc.Payments, 'Update').and.returnValue(updatedpayment.promise);
				spyOn(rootScope, '$broadcast').and.callThrough();
				scope.updatePayment();
				expect(oc.Payments.Update).toHaveBeenCalledWith(order.ID, payment.ID, payment);
				scope.$digest();
				expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:PaymentsUpdated');
			})
		})
	});

	describe('Controller: PaymentSpendingAccountCtrl', function() {
		var paymentPOCtrl,
			order = {ID:'ORDER_ID'},
			payment = {ID:'PAYMENT_ID', Type:'OtherPaymentType'},
			controller;

		beforeEach(inject(function($controller) {
			controller = $controller;
		}));

		describe('Initalize payment details', function() {
			//TODO: The watch on the $scope.OCPaymentSpendingAccount form is throwing off these tests
			describe('When a payment is not passed through', function() {
				beforeEach(inject(function($compile) {
					scope.payment = undefined;
					scope.order = order;
				}));
				it ('should list payments', function() {
					spyOn(oc.Payments, 'List').and.callThrough();
					paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
						$scope: scope
					});
					expect(oc.Payments.List).toHaveBeenCalledWith(order.ID);
				});
				xit ('should update the first existing payment to a spending account payment', function() {
					var existingpayments = q.defer();
					existingpayments.resolve({Items: [{ID: 'EXISTING_PAYMENT_ID'}]});
					spyOn(oc.Payments, 'List').and.returnValue(existingpayments.promise);

					var df = q.defer();
					df.resolve('UPDATED_PAYMENT');
					spyOn(oc.Payments, 'Patch').and.returnValue(df.resolve);

					paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
						$scope: scope
					});
					scope.$digest();
					expect(oc.Payments.Patch).toHaveBeenCalledWith(order.ID, 'EXISTING_PAYMENT_ID', {
						Type: "SpendingAccount",
						xp: {
							PONumber: null
						},
						CreditCardID: null,
						SpendingAccountID: null,
						Amount: null
					});
				});
				xit ('should create a new payment if one does not exist', function() {
					var nopayments = q.defer();
					nopayments.resolve({Items:[]});
					spyOn(oc.Payments, 'List').and.returnValue(nopayments.promise);

					var df = q.defer();
					df.resolve("NEW_PAYMENT");
					spyOn(oc.Payments, 'Create').and.returnValue(df.resolve);

					paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
						$scope: scope
					});
					scope.$digest();
					expect(oc.Payments.Create).toHaveBeenCalledWith(order.ID, {Type: "SpendingAccount"});
					//scope.$digest(); TODO: make this expect statement work
					//expect(paymentPOCtrl.payment).toBe("NEW_PAYMENT");
				})
			});
			xdescribe('When a payment is passed through', function() {
				it ('should update payment to a spending account payment', function() {
					scope.payment = payment;
					scope.order = order;

					paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
						$scope: scope
					});

					expect(scope.payment.CreditCardID).toBeUndefined();
					expect(scope.payment.xp).toBeUndefined();
					expect(scope.showPaymentOptions).toBeTruthy();
				});
			});
		});

		xdescribe('$scope.updatePayment()', function() {
			//TODO: The watch on the $scope.OCPaymentSpendingAccount form is throwing off these tests
			it ('Should patch the current payment to a spending account payment', function() {
				scope.payment = payment;
				scope.order = order;
				paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
					$scope: scope
				});
				var updatedpayment = q.defer();
				updatedpayment.resolve();
				spyOn(oc.Payments, 'Update').and.returnValue(updatedpayment.promise);
				spyOn(rootScope, '$broadcast').and.callThrough();
				scope.updatePayment({spendingAccount:{ID:"FAKE_SPENDING_ACCOUNT"}});
				expect(oc.Payments.Update).toHaveBeenCalledWith(order.ID, payment.ID, payment);
				scope.$digest();
				expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:PaymentsUpdated');
				expect(scope.showPaymentOptions).toBeFalsy();
			})
		})
	});
});