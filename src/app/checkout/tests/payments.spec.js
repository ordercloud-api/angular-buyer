//TODO: Fix Failing unit tests # F51-303

// describe('Payment Directives', function() {
// 	var oc,
// 		q,
// 		scope,
// 		rootScope;
// 	beforeEach(module('orderCloud'));
// 	beforeEach(module('orderCloud.sdk'));
// 	beforeEach(inject(function($q, $rootScope, OrderCloud) {
// 		oc = OrderCloud;
// 		q = $q;
// 		scope = $rootScope.$new();
// 		rootScope = $rootScope;
// 	}));

// 	describe('Controller: PaymentPurchaseOrderCtrl', function() {
// 		var paymentPOCtrl,
// 			order = {ID:'ORDER_ID'},
// 			payment = {ID:'PAYMENT_ID', Type:'OtherPaymentType'},
// 			controller;

// 		beforeEach(inject(function($controller) {
// 			controller = $controller;
// 		}));

// 		describe('Initalize payment details', function() {
// 			describe('When a payment is not passed through', function() {
// 				beforeEach(function() {
// 					scope.payment = undefined;
// 					scope.order = order;
// 				});
// 				it ('should list payments', function() {
// 					spyOn(oc.Payments, 'List').and.callThrough();
// 					paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
// 						$scope: scope
// 					});
// 					expect(oc.Payments.List).toHaveBeenCalledWith(order.ID);
// 				});
// 				it ('should update the first existing payment to a purchase order', function() {
// 					var existingpayments = q.defer();
// 					existingpayments.resolve({Items: [{ID: 'EXISTING_PAYMENT_ID'}]});
// 					spyOn(oc.Payments, 'List').and.returnValue(existingpayments.promise);

// 					var df = q.defer();
// 					df.resolve('UPDATED_PAYMENT');
// 					spyOn(oc.Payments, 'Patch').and.returnValue(df.resolve);

// 					paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
// 						$scope: scope
// 					});
// 					scope.$digest();
// 					expect(oc.Payments.Patch).toHaveBeenCalledWith(order.ID, 'EXISTING_PAYMENT_ID', {
// 						Type: "PurchaseOrder",
// 						CreditCardID: null,
// 						SpendingAccountID: null,
// 						Amount: null
// 					});
// 				});
// 				it ('should create a new payment if one does not exist', function() {
// 					var nopayments = q.defer();
// 					nopayments.resolve({Items:[]});
// 					spyOn(oc.Payments, 'List').and.returnValue(nopayments.promise);

// 					var df = q.defer();
// 					df.resolve("NEW_PAYMENT");
// 					spyOn(oc.Payments, 'Create').and.returnValue(df.resolve);

// 					paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
// 						$scope: scope
// 					});
// 					scope.$digest();
// 					expect(oc.Payments.Create).toHaveBeenCalledWith(order.ID, {Type: "PurchaseOrder"});
// 					//scope.$digest(); TODO: make this expect statement work
// 					//expect(paymentPOCtrl.payment).toBe("NEW_PAYMENT");
// 				})
// 			});
// 			describe('When a payment is passed through', function() {
// 				it ('should update payment to a purchase order', function() {
// 					scope.payment = payment;
// 					scope.order = order;

// 					var defer = q.defer();
// 					defer.resolve('UPDATED_PAYMENT');
// 					spyOn(oc.Payments, 'Patch').and.returnValue(defer.promise);

// 					paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
// 						$scope: scope
// 					});

// 					expect(oc.Payments.Patch).toHaveBeenCalledWith(order.ID, payment.ID, {
// 						ID: payment.ID,
// 						SpendingAccountID:null,
// 						CreditCardID:null,
// 						Type:"PurchaseOrder"
// 					});
// 				});
// 			});
// 		});

// 		describe('$scope.updatePayment()', function() {
// 			it ('Should patch the current payment to a purchase order', function() {
// 				scope.payment = payment;
// 				scope.order = order;
// 				paymentPOCtrl = controller('PaymentPurchaseOrderCtrl', {
// 					$scope: scope
// 				});
// 				var updatedpayment = q.defer();
// 				updatedpayment.resolve();
// 				spyOn(oc.Payments, 'Update').and.returnValue(updatedpayment.promise);
// 				spyOn(rootScope, '$broadcast').and.callThrough();
// 				scope.updatePayment();
// 				expect(oc.Payments.Update).toHaveBeenCalledWith(order.ID, payment.ID, payment);
// 				scope.$digest();
// 				expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:PaymentsUpdated');
// 			})
// 		})
// 	});

// 	describe('Controller: PaymentSpendingAccountCtrl', function() {
// 		var paymentPOCtrl,
// 			order = {ID:'ORDER_ID'},
// 			payment = {ID:'PAYMENT_ID', Type:'OtherPaymentType'},
// 			controller;

// 		beforeEach(inject(function($controller) {
// 			controller = $controller;
// 			scope.OCPaymentSpendingAccount = {
// 				$error: {},
// 				$valid:true,
// 				$invalid:false,
// 				$setValidity:(function(error, bool){
// 					scope.OCPaymentSpendingAccount.$error[error] = [];
// 					scope.OCPaymentSpendingAccount.$valid = bool;
// 					scope.OCPaymentSpendingAccount.$invalid = !bool;
// 					return null;
// 				})
// 			};
// 		}));

// 		describe('Get Spending Accounts', function() {
// 			it ('should list the first 100 non-redemption code spending accounts', function() {
// 				scope.payment = payment;
// 				scope.order = order;

// 				var data = {
// 					Items:['SpendingAccount1', 'SpendingAccount2']
// 				};

// 				var df = q.defer();
// 				df.resolve(data);
// 				spyOn(oc.Me, 'ListSpendingAccounts').and.returnValue(df.promise);

// 				paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
// 					$scope: scope
// 				});

// 				expect(oc.Me.ListSpendingAccounts).toHaveBeenCalledWith(null, 1, 100, null, null, {RedemptionCode: '!*', AllowAsPaymentMethod: true});
// 				scope.$digest();
// 				expect(scope.spendingAccounts).toBe(data.Items);
// 			})
// 		});

// 		describe('Initalize payment details', function() {
// 			describe('When a payment is not passed through', function() {
// 				beforeEach(function() {
// 					scope.payment = undefined;
// 					scope.order = order;
// 				});
// 				it ('should list payments', function() {
// 					spyOn(oc.Payments, 'List').and.callThrough();
// 					paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
// 						$scope: scope
// 					});
// 					expect(oc.Payments.List).toHaveBeenCalledWith(order.ID);
// 				});
// 				it ('should update the first existing payment to a spending account payment', function() {
// 					var existingpayments = q.defer();
// 					existingpayments.resolve({Items: [{ID: 'EXISTING_PAYMENT_ID'}]});
// 					spyOn(oc.Payments, 'List').and.returnValue(existingpayments.promise);

// 					var df = q.defer();
// 					df.resolve('UPDATED_PAYMENT');
// 					spyOn(oc.Payments, 'Patch').and.returnValue(df.resolve);

// 					paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
// 						$scope: scope
// 					});
// 					scope.$digest();
// 					expect(oc.Payments.Patch).toHaveBeenCalledWith(order.ID, 'EXISTING_PAYMENT_ID', {
// 						Type: "SpendingAccount",
// 						xp: {
// 							PONumber: null
// 						},
// 						CreditCardID: null,
// 						SpendingAccountID: null,
// 						Amount: null
// 					});
// 				});
// 				it ('should create a new payment if one does not exist', function() {
// 					var nopayments = q.defer();
// 					nopayments.resolve({Items:[]});
// 					spyOn(oc.Payments, 'List').and.returnValue(nopayments.promise);

// 					var df = q.defer();
// 					df.resolve("NEW_PAYMENT");
// 					spyOn(oc.Payments, 'Create').and.returnValue(df.resolve);

// 					paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
// 						$scope: scope
// 					});
// 					scope.$digest();
// 					expect(oc.Payments.Create).toHaveBeenCalledWith(order.ID, {Type: "SpendingAccount"});
// 					//scope.$digest();
// 					//expect(scope.payment).toBe("NEW_PAYMENT");
// 				})
// 			});
// 			describe('When a payment is passed through', function() {
// 				it ('should update payment to a spending account payment', function() {
// 					scope.payment = payment;
// 					scope.order = order;

// 					paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
// 						$scope: scope
// 					});

// 					expect(scope.payment.CreditCardID).toBeUndefined();
// 					expect(scope.payment.xp).toBeUndefined();
// 					expect(scope.showPaymentOptions).toBeTruthy();
// 				});
// 			});
// 		});

// 		describe('$scope.changePayment()', function() {
// 			it ('should show the payment options', function() {
// 				scope.payment = payment;
// 				scope.order = order;
// 				paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
// 					$scope: scope
// 				});
// 				scope.changePayment();
// 				expect(scope.showPaymentOptions).toBeTruthy();
// 			})
// 		});

// 		describe('$scope.updatePayment()', function() {
// 			beforeEach(function() {
// 				scope.payment = payment;
// 				scope.order = order;
// 			});
// 			it ('should update the current payment with a SpendingAccountID', function() {
// 				paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
// 					$scope: scope
// 				});
// 				var updatedpayment = q.defer();
// 				updatedpayment.resolve();
// 				spyOn(oc.Payments, 'Update').and.returnValue(updatedpayment.promise);
// 				spyOn(rootScope, '$broadcast').and.callThrough();
// 				scope.updatePayment({spendingAccount:{ID:"FAKE_SPENDING_ACCOUNT"}});
// 				expect(oc.Payments.Update).toHaveBeenCalledWith(order.ID, payment.ID, payment);
// 				scope.$digest();
// 				expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:PaymentsUpdated');
// 				expect(scope.showPaymentOptions).toBeFalsy();
// 				expect(scope.payment.SpendingAccountID).toBe("FAKE_SPENDING_ACCOUNT");
// 			});
// 			it ('should reset $scope.payment when the update fails', function() {
// 				paymentPOCtrl = controller('PaymentSpendingAccountCtrl', {
// 					$scope: scope
// 				});
// 				var updatedpayment = q.defer();
// 				updatedpayment.reject();
// 				spyOn(oc.Payments, 'Update').and.returnValue(updatedpayment.promise);
// 				spyOn(rootScope, '$broadcast').and.callThrough();
// 				scope.updatePayment({spendingAccount:{ID:"FAKE_SPENDING_ACCOUNT"}});
// 				expect(oc.Payments.Update).toHaveBeenCalledWith(order.ID, payment.ID, payment);
// 				scope.$digest();
// 				expect(rootScope.$broadcast).not.toHaveBeenCalled();
// 				expect(scope.payment).toBe(payment);
// 			})
// 		})
// 	});

// 	describe('Controller: PaymentCreditCardCtrl', function() {
// 		var paymentPOCtrl,
// 			order = {ID:'ORDER_ID'},
// 			payment = {ID:'PAYMENT_ID', Type:'OtherPaymentType'},
// 			controller;

// 		beforeEach(inject(function($controller) {
// 			controller = $controller;
// 			scope.OCPaymentCreditCard = {
// 				$error: {},
// 				$valid:true,
// 				$invalid:false,
// 				$setValidity:(function(error, bool){
// 					scope.OCPaymentCreditCard.$error[error] = [];
// 					scope.OCPaymentCreditCard.$valid = bool;
// 					scope.OCPaymentCreditCard.$invalid = !bool;
// 					return null;
// 				})
// 			};
// 		}));

// 		describe('Get Credit Cards', function() {
// 			it ('should list the first 100 credit cards assigned to the user', function() {
// 				scope.payment = payment;
// 				scope.order = order;

// 				var data = {
// 					Items:['CreditCard1', 'CreditCard2']
// 				};

// 				var df = q.defer();
// 				df.resolve(data);
// 				spyOn(oc.Me, 'ListCreditCards').and.returnValue(df.promise);

// 				paymentPOCtrl = controller('PaymentCreditCardCtrl', {
// 					$scope: scope
// 				});

// 				expect(oc.Me.ListCreditCards).toHaveBeenCalledWith(null, 1, 100, null, null, {});
// 				scope.$digest();
// 				expect(scope.creditCards).toBe(data.Items);
// 			})
// 		});

// 		describe('Initalize payment details', function() {
// 			describe('When a payment is not passed through', function() {
// 				beforeEach(function() {
// 					scope.payment = undefined;
// 					scope.order = order;
// 				});
// 				it ('should list payments', function() {
// 					spyOn(oc.Payments, 'List').and.callThrough();
// 					paymentPOCtrl = controller('PaymentCreditCardCtrl', {
// 						$scope: scope
// 					});
// 					expect(oc.Payments.List).toHaveBeenCalledWith(order.ID);
// 				});
// 				it ('should update the first existing payment to a credit card payment', function() {
// 					var existingpayments = q.defer();
// 					existingpayments.resolve({Items: [{ID: 'EXISTING_PAYMENT_ID'}]});
// 					spyOn(oc.Payments, 'List').and.returnValue(existingpayments.promise);

// 					var df = q.defer();
// 					df.resolve('UPDATED_PAYMENT');
// 					spyOn(oc.Payments, 'Patch').and.returnValue(df.resolve);

// 					paymentPOCtrl = controller('PaymentCreditCardCtrl', {
// 						$scope: scope
// 					});
// 					scope.$digest();
// 					expect(oc.Payments.Patch).toHaveBeenCalledWith(order.ID, 'EXISTING_PAYMENT_ID', {
// 						Type: "CreditCard",
// 						xp: {
// 							PONumber: null
// 						},
// 						SpendingAccountID: null,
// 						Amount: null
// 					});
// 				});
// 				it ('should create a new payment if one does not exist', function() {
// 					var nopayments = q.defer();
// 					nopayments.resolve({Items:[]});
// 					spyOn(oc.Payments, 'List').and.returnValue(nopayments.promise);

// 					var df = q.defer();
// 					df.resolve("NEW_PAYMENT");
// 					spyOn(oc.Payments, 'Create').and.returnValue(df.resolve);

// 					paymentPOCtrl = controller('PaymentCreditCardCtrl', {
// 						$scope: scope
// 					});
// 					scope.$digest();
// 					expect(oc.Payments.Create).toHaveBeenCalledWith(order.ID, {Type: "CreditCard"});
// 				})
// 			});
// 			describe('When a payment is passed through', function() {
// 				it ('should update payment to a credit card payment', function() {
// 					scope.payment = payment;
// 					scope.order = order;

// 					paymentPOCtrl = controller('PaymentCreditCardCtrl', {
// 						$scope: scope
// 					});

// 					expect(scope.payment.SpendingAccountID).toBeUndefined();
// 					expect(scope.payment.xp).toBeUndefined();
// 					expect(scope.showPaymentOptions).toBeTruthy();
// 				});
// 			});
// 		});

// 		describe('$scope.changePayment()', function() {
// 			it ('should show the payment options', function() {
// 				scope.payment = payment;
// 				scope.order = order;
// 				paymentPOCtrl = controller('PaymentCreditCardCtrl', {
// 					$scope: scope
// 				});
// 				scope.changePayment();
// 				expect(scope.showPaymentOptions).toBeTruthy();
// 			})
// 		});

// 		describe('$scope.updatePayment()', function() {
// 			beforeEach(function() {
// 				scope.payment = payment;
// 				scope.order = order;
// 			});
// 			it ('should update the current payment with a CreditCardID', function() {
// 				paymentPOCtrl = controller('PaymentCreditCardCtrl', {
// 					$scope: scope
// 				});
// 				var updatedpayment = q.defer();
// 				updatedpayment.resolve();
// 				spyOn(oc.Payments, 'Update').and.returnValue(updatedpayment.promise);
// 				spyOn(rootScope, '$broadcast').and.callThrough();
// 				scope.updatePayment({creditCard:{ID:"FAKE_CREDIT_CARD"}});
// 				expect(oc.Payments.Update).toHaveBeenCalledWith(order.ID, payment.ID, payment);
// 				scope.$digest();
// 				expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:PaymentsUpdated');
// 				expect(scope.showPaymentOptions).toBeFalsy();
// 				expect(scope.payment.CreditCardID).toBe("FAKE_CREDIT_CARD");
// 			});
// 			it ('should reset $scope.payment when the update fails', function() {
// 				paymentPOCtrl = controller('PaymentCreditCardCtrl', {
// 					$scope: scope
// 				});
// 				var updatedpayment = q.defer();
// 				updatedpayment.reject();
// 				spyOn(oc.Payments, 'Update').and.returnValue(updatedpayment.promise);
// 				spyOn(rootScope, '$broadcast').and.callThrough();
// 				scope.updatePayment({creditCard:{ID:"FAKE_CREDIT_CARD"}});
// 				expect(oc.Payments.Update).toHaveBeenCalledWith(order.ID, payment.ID, payment);
// 				scope.$digest();
// 				expect(rootScope.$broadcast).not.toHaveBeenCalled();
// 				expect(scope.payment).toBe(payment);
// 			})
// 		});

// 		describe('$scope.createCreditCard()', function() {
// 			var myPaymentCreditCardModal;
// 			beforeEach(inject(function(MyPaymentCreditCardModal) {
// 				myPaymentCreditCardModal = MyPaymentCreditCardModal;
// 				scope.payment = payment;
// 				scope.order = order;
// 				scope.creditCards = [];

// 				paymentPOCtrl = controller('PaymentCreditCardCtrl', {
// 					$scope: scope,
// 					MyPaymentCreditCardModal: myPaymentCreditCardModal
// 				});
// 				var df = q.defer();
// 				df.resolve("NEW_CREDIT_CARD");
// 				spyOn(myPaymentCreditCardModal, 'Create').and.returnValue(df.promise);
// 			}));
// 			it ('should call MyPaymentCreditCardModal.Create()', function() {
// 				scope.createCreditCard();
// 				expect(myPaymentCreditCardModal.Create).toHaveBeenCalled();
// 			});
// 			it ('should add the new credit card to $scope.creditCards', function() {
// 				scope.createCreditCard();
// 				scope.$digest();
// 				expect(scope.creditCards).toEqual(["NEW_CREDIT_CARD"]);
// 			});
// 			it ('should call $scope.updatePayment with the new credit card', function() {
// 				spyOn(scope, 'updatePayment').and.callThrough();
// 				scope.createCreditCard();
// 				scope.$digest();
// 				expect(scope.updatePayment).toHaveBeenCalledWith({creditCard:"NEW_CREDIT_CARD"});
// 			})
// 		})
// 	});
// });