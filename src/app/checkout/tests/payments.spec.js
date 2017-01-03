describe('Payment Directives', function() {
	var oc,
		q,
		scope;
	beforeEach(module('orderCloud'));
	beforeEach(module('orderCloud.sdk'));
	beforeEach(inject(function($q, $rootScope, OrderCloud) {
		oc = OrderCloud;
		q = $q;
		scope = $rootScope.$new();
	}));

	xdescribe('Controller: PaymentPurchaseOrderCtrl', function() {
		var paymentPOCtrl,
			order = {ID:'ORDER_ID'},
			payment = {ID:'PAYMENT_ID', Type:'PurchaseOrder'},
			controller;

		describe('$scope.init()', function() {
			beforeEach(inject(function($controller) {
				controller = $controller;
			}));
			describe('When a payment is not passed through', function() {
				beforeEach(function() {
					scope.payment = undefined;
					scope.order = order;
					paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
						$scope: scope
					});
				});
				it ('should list payments', function() {
					spyOn(oc.Payments, 'List').and.callThrough();
					scope.init();
					expect(oc.Payments.List).toHaveBeenCalledWith(order.ID);
				});
				it ('should update the first existing payment to a purchase order', function() {
					var existingpayments = q.defer();
					existingpayments.resolve({Items: [{ID: 'EXISTING_PAYMENT_ID'}]});
					spyOn(oc.Payments, 'List').and.returnValue(existingpayments.promise);

					var df = q.defer();
					df.resolve('UPDATED_PAYMENT');
					spyOn(oc.Payments, 'Patch').and.returnValue(df.resolve);

					scope.init();
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
					df.resolve('NEW_PAYMENT');
					spyOn(oc.Payments, 'Create').and.returnValue(df.resolve);

					scope.init();
					scope.$digest();
					expect(oc.Payments.Create).toHaveBeenCalledWith(order.ID, {Type: "PurchaseOrder"});
				})
			});
			describe('When a payment is passed through', function() {
				beforeEach(function() {
					scope.payment = payment;
					scope.order = order;
					paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
						$scope: scope
					});
					var defer = q.defer();
					defer.resolve('UPDATED_PAYMENT');
					spyOn(oc.Payments, 'Patch').and.returnValue(defer.promise);
					scope.init();
				});
				it ('should update payment to a purchase order', function() {
					expect(oc.Payments.Patch).toHaveBeenCalledWith(order.ID, payment.ID, {
						SpendingAccountID:null,
						CreditCardID:null,
						Type:"PurchaseOrder"
					});
				});
			});
		});

		xdescribe('When no payments exist on the order', function() {
			beforeEach(function() {
				var defer = q.defer();
				defer.resolve({Items:[]});
				spyOn(oc.Payments, 'List').and.returnValue(defer.promise);

				var df = q.defer();
				df.resolve('NEW_PAYMENT');
				spyOn(oc.Payments, 'Create').and.returnValue(df.promise);
			});
			it ('should create a new purchase order payment on the order', function() {
				scope.$digest();
				expect(oc.Payments.Patch).toHaveBeenCalledWith(orderid, {Type:'PurchaseOrder'});
			});
			it ('should set the scope.payment to be the newly created payment', function() {
				scope.$digest();
				expect(scope.payment).toBe('NEW_PAYMENT');
			})
		});
		xdescribe('When payments exist on the order', function() {
			beforeEach(function() {
				var defer = q.defer();
				defer.resolve({Items:[{ID:'PAYMENT_ID'}]});
				spyOn(oc.Payments, 'List').and.returnValue(defer.promise);
			})
		})
	});
});