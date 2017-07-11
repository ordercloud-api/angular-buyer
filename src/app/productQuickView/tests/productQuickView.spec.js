describe('Component: Product Quick View', function() {
        uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);
    describe('Service: ocProductQuickView', function() {
        describe('Method: Open', function() {
            it('should open the modal for product quick view', function() {
                spyOn(uibModalService, 'open').and.callThrough();
                ocProductQuickViewService.Open();
                expect(uibModalService.open).toHaveBeenCalledWith({
                    backdrop: 'static',
                    templateUrl: 'productQuickView/templates/productQuickView.modal.html',
                    controller: 'ProductQuickViewCtrl',
                    controllerAs: 'productQuickView',
                    size: 'lg',
                    animation: false,
                    resolve: {
                        SelectedProduct: jasmine.any(Function),
                        CurrentOrder: jasmine.any(Function)
                    }
                });
            })
        })
    });
    describe('Directive: ocProductQuickView', function() {
        var element,
            directiveScope
            ;
        beforeEach(function() {
            scope.product = mock.Product;
            scope.currentOrder = mock.Order;
            element = compile('<button oc-product-quick-view '
                            + 'product="product" ' 
                            + 'current-order="currentOrder"></button>')(scope);
            directiveScope = element.isolateScope();
            spyOn(ocProductQuickViewService, 'Open');
        });
        it('should initialize the isolate scope', function(){
            expect(directiveScope.product).toEqual(mock.Product);
            expect(directiveScope.currentOrder).toEqual(mock.Order);
        });
        it('should call ocProductQuickView.Open when clicked', function(){
            element.triggerHandler('click');
            expect(ocProductQuickViewService.Open).toHaveBeenCalledWith(mock.Order, mock.Product);
        })
    });
    describe('Controller: ProductQuickViewController', function() {
        var productQuickViewCtrl,
            lineItemHelpers;
        beforeEach(inject(function($controller, ocLineItems) {
            lineItemHelpers = ocLineItems;
            productQuickViewCtrl = $controller('ProductQuickViewCtrl', {
                $uibModalInstance: uibModalInstance,
                SelectedProduct: mock.Product,
                CurrentOrder: mock.Order
            });
        }));
        describe('addToCart', function() {
            beforeEach(function() {
                spyOn(lineItemHelpers, 'AddItem').and.returnValue(dummyPromise);
                spyOn(toastrService, 'success');
                productQuickViewCtrl.addToCart();
            });
            it('should add line items to the current order', function() {
                expect(lineItemHelpers.AddItem).toHaveBeenCalledWith(mock.Order, mock.Product)
            });
            it('should call toastr success', function() {
                scope.$digest();
                expect(toastrService.success).toHaveBeenCalled();
            });
            it('should close the modal', function() {
                expect(uibModalInstance.close).toHaveBeenCalled();
            });
        });
        describe('cancel', function() {
            it('should dismiss the modal', function(){
                productQuickViewCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
    })
})