describe('Component: ocRepeatOrder', function(){
    describe('Directive: ocRepeatOrder', function(){
        var element,
            previousOrder;
        beforeEach(function(){
            var dfd = q.defer();
            dfd.resolve(mock.LineItems);
            spyOn(ocReorderModalService, 'GetValidLineItems').and.returnValue(dfd.promise);
            spyOn(ocReorderModalService, 'Open').and.returnValue(dummyPromise);

            previousOrder = 'MockPreviousOrderID';
            scope.previousOrder = previousOrder;
            scope.currentOrder = mock.Order.ID;
            element = compile('<button oc-reorder="previousOrder" current-order-id="currentOrder"></button>')(scope);
        });
        it('should initialize isolate the isolate scope',function(){
            expect(element.isolateScope().ocReorder).toEqual(previousOrder);
            expect(element.isolateScope().currentOrderId).toEqual(mock.Order.ID);
        });
        it('should call ocReorderModal.GetValidLineItems when clicked', function(){
            element.triggerHandler('click');
            expect(ocReorderModalService.GetValidLineItems).toHaveBeenCalledWith(previousOrder);
        })
        it('should call ocReorderModal.Open when clicked', function(){
            element.triggerHandler('click');
            scope.$digest();
            expect(ocReorderModalService.Open).toHaveBeenCalledWith(mock.Order.ID, mock.LineItems);
        })
    })



    describe('Controller: ReorderModalCtrl', function(){
        var uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);
        beforeEach(inject(function($controller){
            reorderModalCtrl = $controller('ReorderModalCtrl', {
                OrderID: mock.Order.ID,
                LineItems: {valid: {},invalid: {}},
                $uibModalInstance: uibModalInstance
            })
        }));
        describe('cancel', function() {
            it('should call the modalInstance dismiss method', function(){
                reorderModalCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
        describe('submit', function(){
            beforeEach(function(){
                reorderModalCtrl.validLI = mock.LineItems;
                reorderModalCtrl.orderid = mock.Order.ID;

                spyOn(ocReorderModalService, 'AddLineItemsToCart').and.returnValue(dummyPromise);
                spyOn(state, 'go');
                reorderModalCtrl.submit();
            })
            it('should call ocReorderdal.AddLineItemsToCart', function(){
                expect(ocReorderModalService.AddLineItemsToCart).toHaveBeenCalledWith(mock.LineItems, mock.Order.ID);
            })
            it('should close the modal instance', function(){
                scope.$digest();
                expect(uibModalInstance.close).toHaveBeenCalled();
            })
            it('should go to cart state', function(){
                scope.$digest();
                expect(state.go).toHaveBeenCalledWith('cart', {}, {reload: true});
            })
        })
    });


    describe('Factory: ocReorderModal', function(){
        describe('Open', function(){
            var modalOptions,
            actualOptions;
            var uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);
            beforeEach(function(){
                modalOptions = {
                    templateUrl: 'common/directives/oc-reorder/templates/oc-reorder.modal.html',
                    controller:  'ReorderModalCtrl',
                    controllerAs: 'reorderModal',
                    size: 'md',
                    resolve: {
                        //we dont care what gets returned here because functions can't be 
                        //compared anyway. We do however mock a function that captures the  options
                        //passed in and verify they are the same, in the test.
                        OrderID: jasmine.any(Function),
                        LineItems: jasmine.any(Function)
                    }
                }
                spyOn(uibModalService, 'open').and.callFake(function(options) {
                    actualOptions = options;
                    return uibModalInstance;
                });
                var lineItems = q.defer();
                lineItems.resolve(mock.LineItems);
                spyOn(ocReorderModalService, 'GetValidLineItems').and.returnValue(lineItems.promise);

                var order = q.defer();
                order.resolve({Items: mock.Order});
                spyOn(oc.Me, 'ListOrders').and.returnValue(order.promise)

            });
            it('should call $uibModal.open', function() {
                ocReorderModalService.Open(mock.Order.ID, mock.LineItems);
                expect(uibModalService.open).toHaveBeenCalled();
                expect(actualOptions.resolve.LineItems()).toEqual(mock.LineItems);
            });
        })

        describe('GetValidLineItems', function(){
            var previousOrderID = mock.Order.ID;
            var mockLineItems = [{ID: 'testLI1', ProductID: 'A'},{ID: 'testLI2', ProductID: 'B'}]
            beforeEach(function(){

                var lineItems = q.defer();
                lineItems.resolve(mockLineItems);
                spyOn(ocLineItemsService, 'ListAll').and.returnValue(lineItems.promise);

                var meProducts = q.defer();
                meProducts.resolve(mock.Products);
                spyOn(oc.Me, 'ListProducts').and.returnValue(meProducts.promise);

                ocReorderModalService.GetValidLineItems(previousOrderID);
            });
            it('should call lineItemHelpers ListAll method', function(){
                expect(ocLineItemsService.ListAll).toHaveBeenCalledWith(previousOrderID);
            })
            it('should call Me.ListProducts with joined product IDs', function(){
                scope.$digest();
                expect(oc.Me.ListProducts).toHaveBeenCalledWith({filters: {ID: 'A|B'}})
            })
        });
        describe('AddLineItemsToCart', function(){
            beforeEach(function(){
                var validLI = [
                    {
                        ProductID: 'productID1',
                        Quantity: 'productQuantity1',
                        Specs: 'liSpecs1',
                        Product: {PriceSchedule: {MinQuantity: 1, MaxQuantity: 3}}
                    },
                    {
                        ProductID: 'productID2',
                        Quantity: 'productQuantity2',
                        Specs: 'liSpecs2',
                        Product: {PriceSchedule: {MinQuantity: 2, MaxQuantity: 6}}
                    }
                ];
                var defer = q.defer();
                defer.resolve();
                spyOn(oc.LineItems, 'Create').and.returnValue(defer.promise);
                spyOn(toastrService, 'success');
                ocReorderModalService.AddLineItemsToCart(validLI, mock.Order.ID);
            });
            it('should call the OrderCloud LineItems Create method', function(){
                expect(oc.LineItems.Create).toHaveBeenCalledTimes(2);
            });
            it('should call the toastr success method', function(){
                scope.$digest();
                expect(toastrService.success).toHaveBeenCalledWith('Product(s) Add to Cart', 'Success');
            })
        });
    })
});