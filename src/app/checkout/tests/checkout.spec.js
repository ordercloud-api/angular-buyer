describe('Component: Checkout', function() {
    var scope,
        q,
        oc,
        lineItemHelpers,
        order,
        currentOrder,
        submittedOrder,
        lineItemsList,
        paymentListEmpty,
        paymentListItems,
        orderPayments,
        orderPromotions,
        address;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module(function($provide) {
        $provide.value('CurrentOrder', {
            ID: 'CurrentOrder123',
            BillingAddressID: 'TestAddress123456789',
            ShippingAddressID: 'TestAddress123456789',
            BillingAddress: {
                ID: 'TestAddress123456789'
            }
        });
        $provide.value('OrderPayments', {
            Items: [{Type: 'CreditCard', CreditCardID: 'CC123'}, {Type: 'SpendingAccount', SpendingAccountID: 'SA123'}],
            Meta: {
                Page: 1,
                PageSize: 20,
                TotalCount: 0,
                TotalPages: 1,
                ItemRange: [1, 0]
            }
        });
        $provide.value('SubmittedOrder', {
            ID: 'SubmittedOrder123',
            BillingAddressID: 'TestAddress123456789',
            ShippingAddressID: 'TestAddress123456789',
            BillingAddress: {
                ID: 'TestAddress123456789'
            }
        });
    }));
    beforeEach(inject(function($q, $rootScope, OrderCloud, LineItemHelpers, CurrentOrder, OrderPayments, SubmittedOrder) {
        q = $q;
        oc = OrderCloud;
        lineItemHelpers = LineItemHelpers;
        scope = $rootScope.$new();
        currentOrder = CurrentOrder;
        submittedOrder = SubmittedOrder;
        orderPayments = OrderPayments;
        order = {
            ID: 'TestOrder123456789',
            Type: 'Standard',
            FromUserID: 'TestUser123456789',
            BillingAddressID: 'TestAddress123456789',
            BillingAddress: {
                ID: 'TestAddress123456789'
            },
            ShippingAddressID: 'TestAddress123456789',
            Comments: null,
            ShippingCost: null,
            TaxCost: null,
            Subtotal: 10,
            Total: 10
        };
        lineItemsList = {
            Items : [{ID: '1'}, {ID: '2'}],
            Meta : {
                Page: 1,
                PageSize: 20,
                TotalCount: 2,
                TotalPages: 1,
                ItemRange: [1,2]
            }
        };
        paymentListEmpty = {
            Items: [],
            Meta: {
                Page: 1,
                PageSize: 20,
                TotalCount: 0,
                TotalPages: 1,
                ItemRange: [1, 0]
            }
        };
        paymentListItems = {
            Items: [{Type: 'CreditCard', CreditCardID: 'CC123', Amount: 5}, {Type: 'SpendingAccount', SpendingAccountID: 'SA123', Amount: 5}],
            Meta: {
                Page: 1,
                PageSize: 20,
                TotalCount: 0,
                TotalPages: 1,
                ItemRange: [1, 0]
            }
        };
        orderPromotions = {
            Items: [],
            Meta: {
                Page: 1,
                PageSize: 20,
                TotalCount: 0,
                TotalPages: 1,
                ItemRange: [1, 0]
            }
        };
        address = {
            ID: 'TestAddress123456789'
        };
    }));

    describe('State: checkout', function() {
        var state;
        beforeEach(inject(function($state) {
            state = $state.get('checkout');
            var defer = q.defer();
            defer.resolve();
            spyOn(oc.Me, 'GetAddress').and.returnValue(defer.promise);
            spyOn(oc.Orders, 'ListPromotions').and.returnValue(defer.promise);

            var paymentsDefer = q.defer();
            paymentsDefer.resolve(paymentListEmpty);
            spyOn(oc.Payments, 'List').and.returnValue(paymentsDefer.promise);
            spyOn(oc.Payments, 'Create').and.returnValue(paymentsDefer.promise);
        }));
        it('should call Me.GetAddress for ShippingAddressID', inject(function($injector) {
            $injector.invoke(state.resolve.OrderShipAddress);
            expect(oc.Me.GetAddress).toHaveBeenCalledWith(currentOrder.ShippingAddressID);
        }));
        it('should call Orders.ListPromotions', inject(function($injector) {
            $injector.invoke(state.resolve.CurrentPromotions);
            expect(oc.Orders.ListPromotions).toHaveBeenCalledWith(currentOrder.ID);
        }));
        it('should call Me.GetAddress for BillingAddressID', inject(function($injector) {
            $injector.invoke(state.resolve.OrderBillingAddress);
            expect(oc.Me.GetAddress).toHaveBeenCalledWith(currentOrder.BillingAddressID);
        }));
    });

    describe('Controller: CheckoutController', function() {
        var checkoutController, toaster;
        beforeEach(inject(function($state, $controller, toastr) {
            toaster = toastr;
            state = $state;
            checkoutController = $controller('CheckoutCtrl', {
                $scope: scope,
                OrderShipAddress: address,
                OrderBillingAddress: address,
                CurrentPromotions: orderPromotions,
                OrderPayments: paymentListItems
            });
            var orderDefer = q.defer();
            orderDefer.resolve(order);
            spyOn(oc.Orders, 'Submit').and.returnValue(orderDefer.promise);

            var defer = q.defer();
            defer.resolve(order);
            spyOn(toaster, 'success');
            spyOn($state, 'go').and.returnValue(true);
            spyOn($state, 'transitionTo').and.returnValue(true);

            var addressDefer = q.defer();
            addressDefer.resolve(address);

            spyOn(oc.Me, 'GetAddress').and.returnValue(addressDefer.promise);

            spyOn(oc.Payments, 'List').and.returnValue(defer.promise);

            spyOn(oc.Orders, 'RemovePromotion').and.returnValue(defer.promise);

            spyOn(oc.Orders, 'ListPromotions').and.returnValue(defer.promise);
        }));

        describe('submitOrder', function() {
            beforeEach(function() {
                checkoutController.submitOrder(order);
                scope.$digest();
            });
            it('should call Orders Submit method', function(){
                expect(oc.Orders.Submit).toHaveBeenCalledWith(order.ID);
            });
            it('should go to confirmation state', function() {
                expect(state.go).toHaveBeenCalledWith('confirmation', {orderid: order.ID}, {reload: 'base'});
            });
            it('should call toastr when successful', function(){
                expect(toaster.success).toHaveBeenCalled();
            });
        });

        describe('OC:OrderShipAddressUpdated', function() {
            it('should call Me GetAddress method on broadcasted order ShippingAddressID', inject(function($rootScope) {
                $rootScope.$broadcast('OC:OrderShipAddressUpdated', order);
                scope.$digest();
                expect(oc.Me.GetAddress).toHaveBeenCalledWith(order.ShippingAddressID);
            }));
            it('should update checkoutController.shippingAddress to new address', inject(function($rootScope) {
                checkoutController.shippingAddress = {ID: 'SA123'};
                expect(checkoutController.shippingAddress.ID).toEqual('SA123');
                $rootScope.$broadcast('OC:OrderShipAddressUpdated', order);
                scope.$digest();
                expect(checkoutController.shippingAddress.ID).toEqual('TestAddress123456789');
            }));
        });

        describe('OC:OrderBillAddressUpdated', function() {
            it('should call Me GetAddress method on broadcasted order BillingAddressID', inject(function($rootScope) {
                $rootScope.$broadcast('OC:OrderBillAddressUpdated', order);
                scope.$digest();
                expect(oc.Me.GetAddress).toHaveBeenCalledWith(order.BillingAddressID);
            }));
            it('should update checkoutController.billingAddress to new address', inject(function($rootScope) {
                checkoutController.billingAddress = {ID: 'BA123'};
                expect(checkoutController.billingAddress.ID).toEqual('BA123');
                $rootScope.$broadcast('OC:OrderBillAddressUpdated', order);
                scope.$digest();
                expect(checkoutController.billingAddress.ID).toEqual('TestAddress123456789');
            }));
        });

        describe('removePromotion', function() {
            it('should call Orders RemovePromotion method', function() {
                checkoutController.removePromotion(order, {Code: 'Promo123'});
                scope.$digest();
                expect(oc.Orders.RemovePromotion).toHaveBeenCalledWith(order.ID, 'Promo123');
            });
        });

        describe('OC:UpdatePromotions', function() {
            it('should call Orders ListPromotions method on broadcasted orderid', inject(function($rootScope) {
                $rootScope.$broadcast('OC:UpdatePromotions', order.ID);
                scope.$digest();
                expect(oc.Orders.ListPromotions).toHaveBeenCalledWith(order.ID);
            }));
        });
    });

    describe('Factory: AddressSelectModal', function() {
        var addressSelectModal, uibModal;
        beforeEach(inject(function($uibModal, _AddressSelectModal_) {
            uibModal = $uibModal;
            addressSelectModal = _AddressSelectModal_;
            var defer = q.defer();
            defer.resolve();
            spyOn(uibModal, 'open').and.returnValue(defer.promise);
        }));

        it('should have an Open method', function() {
            expect(typeof addressSelectModal.Open).toBe('function');
        });

        it('should call $uibModal.open when Open method is called', function() {
            addressSelectModal.Open();
            scope.$digest();
            expect(uibModal.open).toHaveBeenCalled();
        });
    });

    describe('Controller: AddressSelectCtrl', function() {
        var addressSelectCtrl, uibModalInstance;
        beforeEach(inject(function($controller) {
            uibModalInstance = {close: function() {}, dismiss: function() {}};;
            addressSelectCtrl = $controller('AddressSelectCtrl', {
                $scope: scope,
                $uibModalInstance: uibModalInstance,
                Addresses: {Items: [], Meta: {}}
            });
            spyOn(uibModalInstance, 'close').and.returnValue();
            spyOn(uibModalInstance, 'dismiss').and.returnValue();
        }));

        describe('select', function() {
            it('should call $uibmodalInstance.close with selected address', function() {
                addressSelectCtrl.select(address);
                scope.$digest();
                expect(uibModalInstance.close).toHaveBeenCalledWith(address);
            });
        });

        describe('createAddress', function() {
            it('should call $uibmodalInstance.close with "create"', function() {
                addressSelectCtrl.createAddress();
                scope.$digest();
                expect(uibModalInstance.close).toHaveBeenCalledWith('create');
            });
        });

        describe('cancel', function() {
            it('should call $uibmodalInstance.dismiss', function() {
                addressSelectCtrl.cancel();
                scope.$digest();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
    });
});

