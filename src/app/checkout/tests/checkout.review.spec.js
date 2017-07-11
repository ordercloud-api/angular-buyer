//TODO: Fix Failing unit tests # F51-303

// describe('Component: Checkout Review', function() {
//     var scope,
//         q,
//         oc,
//         lineItemHelpers,
//         lineItemsList,
//         order,
//         currentOrder,
//         orderPayments;
//     beforeEach(module('orderCloud'));
//     beforeEach(module('orderCloud.sdk'));
//     beforeEach(module(function($provide) {
//         $provide.value('CurrentOrder', {
//             ID: 'CurrentOrder123',
//             BillingAddressID: 'TestAddress123456789',
//             ShippingAddressID: 'TestAddress123456789',
//             BillingAddress: {
//                 ID: 'TestAddress123456789'
//             }
//         });
//         $provide.value('OrderPayments', {
//             Items: [{Type: 'CreditCard', CreditCardID: 'CC123'}, {Type: 'SpendingAccount', SpendingAccountID: 'SA123'}],
//             Meta: {
//                 Page: 1,
//                 PageSize: 20,
//                 TotalCount: 0,
//                 TotalPages: 1,
//                 ItemRange: [1, 0]
//             }
//         });
//     }));
//     beforeEach(inject(function($q, $rootScope, OrderCloud, CurrentOrder, OrderPayments, ocLineItems) {
//         q = $q;
//         oc = OrderCloud;
//         scope = $rootScope.$new();
//         lineItemHelpers = ocLineItems;
//         currentOrder = CurrentOrder;
//         orderPayments = OrderPayments;
//         order = {
//             ID: 'TestOrder123456789',
//             Type: 'Standard',
//             FromUserID: 'TestUser123456789',
//             BillingAddressID: 'TestAddress123456789',
//             BillingAddress: {
//                 ID: 'TestAddress123456789'
//             },
//             ShippingAddressID: 'TestAddress123456789',
//             Comments: null,
//             ShippingCost: null,
//             TaxCost: null,
//             Subtotal: 10,
//             Total: 10
//         };
//         lineItemsList = {
//             Items : [{ID: '1'}, {ID: '2'}],
//             Meta : {
//                 Page: 1,
//                 PageSize: 20,
//                 TotalCount: 2,
//                 TotalPages: 1,
//                 ItemRange: [1,2]
//             }
//         };
//     }));

//     describe('State: checkout.review', function() {
//         var state;
//         beforeEach(inject(function($state) {
//             state = $state.get('checkout.review');
//             var lineItemListDefer = q.defer();
//             lineItemListDefer.resolve(lineItemsList);
//             spyOn(oc.LineItems, 'List').and.returnValue(lineItemListDefer.promise);
//             spyOn(lineItemHelpers, 'GetProductInfo').and.returnValue(lineItemListDefer.promise);

//             var defer = q.defer();
//             defer.resolve();
//             var paymentsDefer = q.defer();
//             paymentsDefer.resolve(orderPayments);
//             spyOn(oc.Payments, 'List').and.returnValue(paymentsDefer.promise);
//             spyOn(oc.Me, 'GetCreditCard').and.returnValue(defer.promise);
//             spyOn(oc.Me, 'GetSpendingAccount').and.returnValue(defer.promise);
//         }));
//         it('should call LineItems.List', inject(function($injector){
//             $injector.invoke(state.resolve.LineItemsList);
//             expect(oc.LineItems.List).toHaveBeenCalledWith(currentOrder.ID);
//         }));
//         it('should call LineItemHelper', inject(function($injector){
//             $injector.invoke(state.resolve.LineItemsList);
//             scope.$digest();
//             expect(lineItemHelpers.GetProductInfo).toHaveBeenCalled();
//         }));
//         it('should call Payment List method', inject(function($injector) {
//             $injector.invoke(state.resolve.OrderPaymentsDetail);
//             scope.$digest();
//             expect(oc.Payments.List).toHaveBeenCalledWith(currentOrder.ID);
//         }));
//         it('should call Me.GetCreditCard for first payment', inject(function($injector) {
//             $injector.invoke(state.resolve.OrderPaymentsDetail);
//             scope.$digest();
//             expect(oc.Me.GetCreditCard).toHaveBeenCalledWith(orderPayments.Items[0].CreditCardID);
//         }));
//         it('should call Me.GetSpendingAccount for second payment', inject(function($injector) {
//             $injector.invoke(state.resolve.OrderPaymentsDetail);
//             scope.$digest();
//             expect(oc.Me.GetSpendingAccount).toHaveBeenCalledWith(orderPayments.Items[1].SpendingAccountID);
//         }));
//     });

//     describe('Controller: CheckoutReviewCtrl', function(){
//         var reviewCtrl,
//             OrderPaymentsDetail = 'FAKE_PAYMENTS',
//             LineItemsList = 'FAKE_LINE_ITEMS';
//         beforeEach(inject(function($controller) {
//             reviewCtrl = $controller('CheckoutReviewCtrl', {
//                 OrderPaymentsDetail: OrderPaymentsDetail,
//                 LineItemsList: LineItemsList
//             });
//         }));
//         it ('should initialize the resolves into the controller view model', function() {
//             expect(reviewCtrl.payments).toBe(OrderPaymentsDetail);
//             expect(reviewCtrl.lineItems).toBe(LineItemsList);
//         });
//     });
// });