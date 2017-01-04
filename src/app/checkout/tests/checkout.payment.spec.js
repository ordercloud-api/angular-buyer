describe('Component: Checkout Payment', function() {
    var scope,
        q,
        oc,
        order,
        address,
        paymentListItems;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function ($q, $rootScope, OrderCloud) {
        q = $q;
        oc = OrderCloud;
        scope = $rootScope.$new();
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
        address = {
            ID: 'TestAddress123456789'
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
    }));

    describe('Controller: CheckoutPaymentCtrl', function() {
        var checkoutPaymentCtrl,
            addressSelectModal,
            myAddressModal,
            rootScope;
        beforeEach(inject(function($rootScope, $controller, AddressSelectModal, MyAddressesModal) {
            addressSelectModal = AddressSelectModal;
            myAddressModal = MyAddressesModal;
            checkoutPaymentCtrl = $controller('CheckoutPaymentCtrl');
            rootScope = $rootScope;
        }));

        describe('Function: createAddress', function() {
            beforeEach(function() {
                var df = q.defer();
                df.resolve({ID:'ADDRESS_ID'});
                spyOn(myAddressModal, 'Create').and.returnValue(df.promise);

                var defer = q.defer();
                defer.resolve('UPDATED_ORDER');
                spyOn(oc.Orders, 'Patch').and.returnValue(defer.promise);

                spyOn(rootScope, '$broadcast').and.callThrough();

                checkoutPaymentCtrl.createAddress(order);
            });
            it ('should call MyAddressModal.Create()', function() {
                expect(myAddressModal.Create).toHaveBeenCalled();
            });
            it ('should set the order.BillingAddressID to the new address ID', function() {
                scope.$digest();
                expect(order.BillingAddressID).toBe('ADDRESS_ID');
            });
            it ('should patch the order with the new order.BillingAddressID', function() {
                scope.$digest();
                expect(oc.Orders.Patch).toHaveBeenCalledWith(order.ID, {BillingAddressID: 'ADDRESS_ID'});
            });
            it ('should broadcast a $rootScope event "OC:OrderBillAddressUpdated"', function() {
                scope.$digest();
                expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:OrderBillAddressUpdated', 'UPDATED_ORDER');
            })
        });

        describe('Function: changeBillingAddress', function() {
            beforeEach(function() {
                var df = q.defer();
                df.resolve({ID:'ADDRESS_ID'});
                spyOn(addressSelectModal, 'Open').and.returnValue(df.promise);

                var defer = q.defer();
                defer.resolve('UPDATED_ORDER');
                spyOn(oc.Orders, 'Patch').and.returnValue(defer.promise);

                spyOn(rootScope, '$broadcast').and.callThrough();

                checkoutPaymentCtrl.changeBillingAddress(order);
            });
            it ('should call AddressSelectModal.Open() with "billing"', function() {
                expect(addressSelectModal.Open).toHaveBeenCalledWith('billing');

            });
            it ('should set the order.BillingAddressID to the new address ID', function() {
                scope.$digest();
                expect(order.BillingAddressID).toBe('ADDRESS_ID');
            });
            it ('should patch the order with the new order.BillingAddressID', function() {
                scope.$digest();
                expect(oc.Orders.Patch).toHaveBeenCalledWith(order.ID, {BillingAddressID: 'ADDRESS_ID'});
            });
            it ('should broadcast a $rootScope event "OC:OrderBillAddressUpdated"', function() {
                scope.$digest();
                expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:OrderBillAddressUpdated', 'UPDATED_ORDER');
            })
        });
    });
});