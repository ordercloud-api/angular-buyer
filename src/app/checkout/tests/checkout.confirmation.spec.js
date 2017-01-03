describe('Component: Checkout Confirmation', function() {
    var scope,
        q,
        oc,
        lineItemHelpers,
        lineItemsList,
        orderPayments,
        order,
        submittedOrder,
        address;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module(function($provide) {
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
    beforeEach(inject(function($q, $rootScope, OrderCloud, LineItemHelpers, SubmittedOrder, OrderPayments) {
        q = $q;
        oc = OrderCloud;
        scope = $rootScope.$new();
        lineItemHelpers = LineItemHelpers;
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
        address = {
            ID: 'TestAddress123456789'
        };
    }));

    describe('State: confirmation', function() {
        var state, stateParams;
        beforeEach(inject(function($state, $stateParams) {
            state = $state.get('confirmation');
            stateParams = $stateParams;
            stateParams.orderid = "SubmittedOrder123";
            var submittedOrderDefer = q.defer();
            submittedOrderDefer.resolve(submittedOrder);
            spyOn(oc.Me, 'GetOrder').and.returnValue(submittedOrderDefer.promise);

            var defer = q.defer();
            defer.resolve();
            spyOn(oc.Me, 'GetAddress').and.returnValue(defer.promise);
            spyOn(oc.Orders, 'ListPromotions').and.returnValue(defer.promise);

            var paymentsDefer = q.defer();
            paymentsDefer.resolve(orderPayments);
            spyOn(oc.Payments, 'List').and.returnValue(paymentsDefer.promise);
            spyOn(oc.Me, 'GetCreditCard').and.returnValue(defer.promise);
            spyOn(oc.Me, 'GetSpendingAccount').and.returnValue(defer.promise);

            var lineItemListDefer = q.defer();
            lineItemListDefer.resolve(lineItemsList);
            spyOn(oc.LineItems, 'List').and.returnValue(lineItemListDefer.promise);
            spyOn(lineItemHelpers, 'GetProductInfo').and.returnValue(lineItemListDefer.promise);
        }));
        it('should call Me.GetOrder for submitted order', inject(function($injector) {
            $injector.invoke(state.resolve.SubmittedOrder);
            expect(oc.Me.GetOrder).toHaveBeenCalledWith('SubmittedOrder123');
        }));
        it('should call Me.GetAddress for ShippingAddressID', inject(function($injector) {
            $injector.invoke(state.resolve.OrderShipAddress);
            expect(oc.Me.GetAddress).toHaveBeenCalledWith(submittedOrder.ShippingAddressID);
        }));
        it('should call Orders.ListPromotions', inject(function($injector) {
            $injector.invoke(state.resolve.OrderPromotions);
            expect(oc.Orders.ListPromotions).toHaveBeenCalledWith(submittedOrder.ID);
        }));
        it('should call Me.GetAddress for BillingAddressID', inject(function($injector) {
            $injector.invoke(state.resolve.OrderBillingAddress);
            expect(oc.Me.GetAddress).toHaveBeenCalledWith(submittedOrder.BillingAddressID);
        }));
        it('should call Payments.List', inject(function($injector) {
            $injector.invoke(state.resolve.OrderPayments);
            expect(oc.Payments.List).toHaveBeenCalledWith(submittedOrder.ID);
        }));
        it('should call Me.GetCreditCard for first payment', inject(function($injector) {
            $injector.invoke(state.resolve.OrderPayments);
            scope.$digest();
            expect(oc.Me.GetCreditCard).toHaveBeenCalledWith(orderPayments.Items[0].CreditCardID);
        }));
        it('should call Me.GetSpendingAccount for second payment', inject(function($injector) {
            $injector.invoke(state.resolve.OrderPayments);
            scope.$digest();
            expect(oc.Me.GetSpendingAccount).toHaveBeenCalledWith(orderPayments.Items[1].SpendingAccountID);
        }));
        it('should call LineItems.List',inject(function($injector){
            $injector.invoke(state.resolve.LineItemsList);
            expect(oc.LineItems.List).toHaveBeenCalledWith(submittedOrder.ID);
        }));
        it('should call LineItemHelper', inject(function($injector){
            $injector.invoke(state.resolve.LineItemsList);
            scope.$digest();
            expect(lineItemHelpers.GetProductInfo).toHaveBeenCalled();
        }));
    });

    describe('Controller: ConfirmationCtrl', function(){
        var confirmCtrl,
            SubmittedOrder = 'FAKE_ORDER',
            OrderShipAddress = 'FAKE_SHIP_ADDRESS',
            OrderPromotions = {Items: 'FAKE_PROMOTIONS'},
            OrderBillingAddress = 'FAKE_BILL_ADDRESS',
            OrderPayments = {Items: 'FAKE_PAYMENTS'},
            LineItemsList = 'FAKE_LINE_ITEMS';
        beforeEach(inject(function($controller) {
            confirmCtrl = $controller('CheckoutConfirmationCtrl', {
                SubmittedOrder: SubmittedOrder,
                OrderShipAddress: OrderShipAddress,
                OrderPromotions: OrderPromotions,
                OrderBillingAddress: OrderBillingAddress,
                OrderPayments: OrderPayments,
                LineItemsList: LineItemsList
            });
        }));
        it ('should initialize the resolves into the controller view model', function() {
            expect(confirmCtrl.order).toBe(SubmittedOrder);
            expect(confirmCtrl.shippingAddress).toBe(OrderShipAddress);
            expect(confirmCtrl.promotions).toBe('FAKE_PROMOTIONS');
            expect(confirmCtrl.billingAddress).toBe(OrderBillingAddress);
            expect(confirmCtrl.payments).toBe('FAKE_PAYMENTS');
            expect(confirmCtrl.lineItems).toBe(LineItemsList);
        });
    });
});