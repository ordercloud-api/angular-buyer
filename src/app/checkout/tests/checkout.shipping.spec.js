//TODO: Fix Failing unit tests # F51-304

// describe('Component: Checkout Shipping', function() {
//     var scope,
//         rootScope,
//         q,
//         oc,
//         order,
//         checkoutConfig,
//         address,
//         rates;
//     beforeEach(module('orderCloud'));
//     beforeEach(module('orderCloud.sdk'));
//     beforeEach(module(function($provide) {
//         $provide.value('CheckoutConfig', {
//             ShippingRates: true,
//             TaxRates: false
//         });
//     }));
//     beforeEach(inject(function($q, $rootScope, OrderCloud, CheckoutConfig) {
//         q = $q;
//         oc = OrderCloud;
//         scope = $rootScope.$new();
//         rootScope = $rootScope;
//         checkoutConfig = CheckoutConfig;
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
//         address = {
//             ID: 'TestAddress123456789'
//         };
//         rates = {
//             Shipments: [
//                 {
//                     Weight: 10,
//                     ShipFromAddressID: '1234',
//                     ShipToAddressID: '2345',
//                     LineItemIDs: [
//                         '1',
//                         '2'
//                     ],
//                     Rates: [
//                         {
//                             Price: 6,
//                             Description: 'UPS Standard'
//                         },
//                         {
//                             Price: 20,
//                             Description: 'UPS Next Day Air'
//                         }
//                     ],
//                     SelectedShipper: {
//                         Price: 6,
//                         Description: 'UPS Standard'
//                     }
//                 }
//             ]
//         };
//     }));

//     describe('Controller: CheckoutShippingCtrl', function() {
//         var checkoutShippingController,
//             toaster,
//             myAddressesModal,
//             addressSelectModal,
//             shippingRates,
//             mockModal;
//         beforeEach(inject(function($state, $controller, toastr, MyAddressesModal, AddressSelectModal, ShippingRates) {
//             toaster = toastr;
//             state = $state;
//             myAddressesModal = MyAddressesModal;
//             addressSelectModal = AddressSelectModal;
//             shippingRates = ShippingRates;

//             mockModal = {
//                 result: {
//                     then: function(confirmCallBack, cancelCallBack) {
//                         this.confirmCallBack = confirmCallBack;
//                         this.cancelCallBack = cancelCallBack;
//                     }
//                 },
//                 close: function(item) {
//                     this.result.confirmCallBack(item);
//                 },
//                 dismiss: function(type) {
//                     this.result.cancelCallBack(type);
//                 }
//             };

//             checkoutShippingController = $controller('CheckoutShippingCtrl', {
//                 $scope: scope
//             });

//             var defer = q.defer();
//             defer.resolve();

//             var orderDefer = q.defer();
//             orderDefer.resolve(order);

//             var shippingRatesDefer = q.defer();
//             shippingRatesDefer.resolve(rates.Shipments);

//             spyOn(myAddressesModal, 'Create').and.returnValue(mockModal.result);
//             spyOn(toaster, 'success');
//             spyOn(addressSelectModal, 'Open').and.returnValue(mockModal.result);
//             spyOn(oc.Orders, 'Patch').and.returnValue(orderDefer.promise);
//             spyOn(rootScope, '$broadcast').and.returnValue(true);
//             spyOn(shippingRates, 'GetRates').and.returnValue(shippingRatesDefer.promise);
//             spyOn(shippingRates, 'AnalyzeShipments').and.returnValue(shippingRatesDefer.promise);
//             spyOn(shippingRates, 'ManageShipments').and.returnValue(defer.promise);
//         }));

//         describe('createAddress', function() {
//             beforeEach(inject(function() {
//                 checkoutShippingController.createAddress(order);
//                 scope.$digest();
//             }));
//             it('should call MyAddressModal Create method', function() {
//                 expect(myAddressesModal.Create).toHaveBeenCalled();
//             });
//             it('should call toastr success after address is created', function() {
//                 mockModal.close(address);
//                 expect(toaster.success).toHaveBeenCalled();
//             });
//             it('should call saveShipAddress which patches order', function() {
//                 checkoutShippingController.saveShipAddress(order);
//                 expect(oc.Orders.Patch).toHaveBeenCalledWith(order.ID, {ShippingAddressID: order.ShippingAddressID});
//             })
//         });

//         describe('changeShippingAddress', function() {
//             beforeEach(function() {
//                 checkoutShippingController.changeShippingAddress(order);
//                 scope.$digest();
//             });
//             it('should call AddressSelectModal Open method with "shipping"', function() {
//                 expect(addressSelectModal.Open).toHaveBeenCalledWith('shipping');
//             });
//             it('should call createAddress if "create" is returned', function() {
//                 mockModal.close('create');
//                 checkoutShippingController.createAddress(order);
//                 expect(myAddressesModal.Create).toHaveBeenCalled();
//             });
//             it('should call saveShipAddress if nothing address is returned', function() {
//                 mockModal.close(address);
//                 checkoutShippingController.saveShipAddress(order);
//                 expect(oc.Orders.Patch).toHaveBeenCalledWith(order.ID, {ShippingAddressID: address.ID});
//             });
//         });

//         describe('saveShipAddress', function() {
//             beforeEach(function() {
//                 checkoutShippingController.saveShipAddress(order);
//                 scope.$digest();
//             });
//             it('should call Orders Patch method', function() {
//                 expect(oc.Orders.Patch).toHaveBeenCalledWith(order.ID, {ShippingAddressID: order.ShippingAddressID});
//             });
//             it('should broadcast "OC:OrderShipAddressUpdates"', function() {
//                  expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:OrderShipAddressUpdated', order);
//             });
//             it('should call getShippingRates', function() {
//                 expect(shippingRates.GetRates).toHaveBeenCalledWith(order);
//             });
//         });

//         describe('initShippingRates', function() {
//             beforeEach(function() {
//                 checkoutShippingController.initShippingRates(order);
//                 scope.$digest();
//             });
//             it('should call getShippingRates', function() {
//                 expect(shippingRates.GetRates).toHaveBeenCalledWith(order);
//             });
//         });

//         describe('getShippingRates', function() {
//             beforeEach(function() {
//                 checkoutShippingController.getShippingRates(order);
//                 scope.$digest();
//             });
//             it('should call ShippingRates GetRates method', function() {
//                 expect(shippingRates.GetRates).toHaveBeenCalledWith(order);
//             });
//             it('should call analyzeShipments', function() {
//                 expect(shippingRates.AnalyzeShipments).toHaveBeenCalledWith(order, rates.Shipments);
//             });
//         });

//         describe('shipperSelected', function() {
//             beforeEach(function() {
//                 checkoutShippingController.shippingRates = rates.Shipments;
//                 checkoutShippingController.shipperSelected(order);
//                 scope.$digest();
//             });
//             it('should call ShippingRates ManageShipments method', function() {
//                 expect(shippingRates.ManageShipments).toHaveBeenCalledWith(order, rates.Shipments);
//             });
//             it('should broadcast "OC:UpdateOrder"', function() {
//                 expect(rootScope.$broadcast).toHaveBeenCalledWith('OC:UpdateOrder', order.ID);
//             });
//         });
//     });

//     describe('Factory: ShippingRates', function() {
//         var resource, apiurl, shippingratesurl, shippingRates, httpBackend;
//         beforeEach(inject(function($resource, _apiurl_, ShippingRates, $httpBackend) {
//             resource = $resource;
//             apiurl = _apiurl_;
//             shippingRates = ShippingRates;
//             httpBackend = $httpBackend;
//             shippingratesurl = apiurl + '/v1/integrationproxy/shippingrates';
//             var defer = q.defer();
//             defer.resolve();
//         }));

//         it('should have a GetRates method', function() {
//             expect(typeof shippingRates.GetRates).toBe('function');
//         });

//         it('should have a GetLineItemRates method', function() {
//             expect(typeof shippingRates.GetLineItemRates).toBe('function');
//         });

//         it('should have a SetShippingCost method', function() {
//             expect(typeof shippingRates.SetShippingCost).toBe('function');
//         });

//         it('should have a ManageShipments method', function() {
//             expect(typeof shippingRates.ManageShipments).toBe('function');
//         });

//         it('should have a AnalyzeShipments method', function() {
//             expect(typeof shippingRates.AnalyzeShipments).toBe('function');
//         });
//     });
// });