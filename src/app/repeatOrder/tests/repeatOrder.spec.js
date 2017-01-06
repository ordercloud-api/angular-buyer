fdescribe('Component: Repeat Order', function(){
    var scope,
        q,
        state,
        modalInstance,
        repeatFactory,
        orderID,
        lineItems
        ;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($rootScope, $q, $state, RepeatOrderFactory) {
        scope = $rootScope.$new();
        q = $q;
        state = $state;
        repeatFactory = RepeatOrderFactory;
        orderID = 'testOrderID123123';
        lineItems = {};
    }));
    describe('Controller: RepeatOrderCtrl', function(){
        var repeatOrderCtrl,
            toaster;
        beforeEach(inject(function($componentController, toastr, RepeatOrderFactory){
            toaster = toastr;
            repeatOrderCtrl = $componentController('RepeatOrderCtrl', {
                repeatFactory: RepeatOrderFactory,
                toaster: toastr,
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
        var repeatOrderModalCtrl,
            toaster;
        beforeEach(inject(function($componentController, toastr, RepeatOrderFactory){
            toaster = toastr;
            repeatOrderModalCtrl = $componentController('RepeatOrderModalCtrl', {
                repeatOrderFactory: RepeatOrderFactory,
                orderID: 'testOrderID123123',
                toaster: toastr,
                lineItems: {
                    valid: {},
                    invalid: {}
                },
                $uibModalInstance: modalInstance
            })
        }));
        describe('cancel', function() {
            beforeEach(function() {
                spyOn(modalInstance, 'dismiss');
                repeatOrderModalCtrl.cancel();
            });
            it('should call the modalInstance dismiss method', function(){
                expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
            })
        });
        describe('submit', function(){
            beforeEach(function(){
                var defer = q.defer();
                defer.resolve();
                spyOn(modalInstance, 'close');
                spyOn(repeatOrderFactory, 'AddLineItemsToCart');
                repeatOrderModalCtrl.submit();
            });
            it('should call the modalInstance close method', function(){
                expect(modalInstance.close).toHaveBeenCalled();
            });
            it('should call the RepeatOrderFactory AddLineItemsToCart method', function(){
                expect(repeatOrderFactory.AddLineItemsToCart).toHaveBeenCalledWith(repeatOrderModalCtrl.lineItems.valid, repeatOrderModalCtrl.orderID);
            })
        })
    });
    describe('Factory: RepeatOrder', function(){
        var oc,
            lineItemHelpers,
            originalOrderID
            ;
        beforeEach(inject(function(OrderCloud, LineItemHelpers){
            oc = OrderCloud;
            lineItemHelpers = LineItemHelpers;
            var defer = q.defer();
            defer.resolve();
            spyOn(lineItemHelpers, 'ListAll').and.returnValue(defer.promise);
            spyOn(oc.Me, 'ListProducts').and.returnValue(defer.promise);
            spyOn(oc.LineItems, 'Create').and.returnValue(defer.promise);
            spyOn(toaster, 'success');
        }));
        it('should call lineItemHelpers ListAll method', function(){
            expect(lineItemHelpers.ListAll).toBeCalledWith(originalOrderID);
        });
        it('should call the OrderCloud Me ListProducts method', function(){
            expect(oc.Me.ListProducts).toHaveBeenCalledWith(null, 1, 100);
        });
        it('should call the OrderCloud LineItems Create method', function(){
            expect(oc.LineItems.Create).toHave
        })
    })
});