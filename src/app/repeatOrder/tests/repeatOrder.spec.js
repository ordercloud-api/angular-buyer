describe('Component: ordercloudRepeatOrder', function(){
    var scope,
        q,
        state,
        modalInstance,
        orderID,
        lineItems
        ;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope, $q, $state) {
        scope = $rootScope.$new();
        q = $q;
        state = $state;
        orderID = 'testOrderID123123';
        lineItems = {};
        modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);
    }));
    describe('Controller: RepeatOrderCtrl', function(){
        var repeatOrderCtrl,
            toaster;
        beforeEach(inject(function($controller, toastr){
            toaster = toastr;
            repeatOrderCtrl = $controller('RepeatOrderCtrl', {
                toastr: toaster,
                orderID: 'undefined',
                lineItems: {
                    valid: {},
                    invalid: {}
                }
            })
        }));
        describe('$onInit', function(){
            beforeEach(function(){
                repeatOrderCtrl.orderid = 'undefined';
                spyOn(toaster, 'error');
            });
            it('should display a toastr error message', function() {
                repeatOrderCtrl.$onInit();
                expect(toaster.error).toHaveBeenCalledWith('repeat order component is not configured correctly. orderid is a required attribute', 'Error');
            })
        })
    });
    describe('Controller: RepeatOrderModalCtrl', function(){
        var repeatOrderModalCtrl;
        var repeatOrderFactory;
        beforeEach(inject(function($controller, $state, RepeatOrderFactory){
            repeatOrderFactory = RepeatOrderFactory;
            repeatOrderModalCtrl = $controller('RepeatOrderModalCtrl', {
                OrderID: 'testOrderID123123',
                $state: $state,
                RepeatOrderFactory: repeatOrderFactory,
                LineItems: {
                    valid: {},
                    invalid: {}
                },
                $uibModalInstance: modalInstance
            });
        }));
        describe('cancel', function() {
            beforeEach(function() {
                repeatOrderModalCtrl.cancel();
            });
            it('should call the modalInstance dismiss method', function(){
                expect(modalInstance.dismiss).toHaveBeenCalled();
            })
        });
        describe('submit', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(repeatOrderFactory, 'AddLineItemsToCart').and.returnValue(defer.promise);
                repeatOrderModalCtrl.submit();
            });
            it('should call the modalInstance close method', function(){
                scope.$digest();
                expect(modalInstance.close).toHaveBeenCalled();
            });
            it('should call the RepeatOrderFactory AddLineItemsToCart method', function(){
                expect(repeatOrderFactory.AddLineItemsToCart).toHaveBeenCalledWith(repeatOrderModalCtrl.validLI, repeatOrderModalCtrl.orderid);
            })
        })
    });
    describe('Factory: RepeatOrderFactory', function(){
        var oc,
            toaster,
            repeatOrderFactory,
            ocLIs,
            originalOrderID
            ;
        beforeEach(inject(function(OrderCloud, toastr, RepeatOrderFactory, ocLineItems){
            oc = OrderCloud;
            toaster = toastr;
            repeatOrderFactory = RepeatOrderFactory;
            ocLIs = ocLineItems;
            originalOrderID = 'testOriginalOrderID123';
        }));
        describe('GetValidLineItems', function(){
            it('should call lineItemHelpers ListAll method', function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(ocLIs, 'ListAll').and.returnValue(defer.promise);
                repeatOrderFactory.GetValidLineItems(originalOrderID);
                expect(ocLIs.ListAll).toBeCalledWith(originalOrderID);
            });
        });
        describe('ListAllMeProducts', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(oc.Me, 'ListProducts').and.returnValue(defer.promise);
            });
            it('should call the OrderCloud Me ListProducts method', function(){
                repeatOrderFactory.ListAllMeProducts();
                expect(oc.Me.ListProducts).toHaveBeenCalledWith(null, 1, 100);
            });
        });
        describe('AddLineItemsToCart', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(oc.LineItems, 'Create').and.returnValue(defer.promise);
            });
            it('should call the OrderCloud LineItems Create method', function(){
                repeatOrderFactory.AddLineItemsToCart();
                expect(oc.LineItems.Create).toHaveBeenCalledWith();
            });
            it('should call the toastr success method', function(){
                spyOn(toaster, 'success');
                repeatOrderFactory.AddLineItemsToCart();
                expect(toaster.success).toHaveBeenCalledWith('Product(s) Add to Cart', 'Success');
            })
        });
    });
});