describe('Service: ocProducts', function() {
        var productsService,
            uibModal;
        beforeEach(inject(function($uibModal, ocProducts) {
            uibModal = $uibModal;
            productsService = ocProducts;
        }));
        describe('Method: Search', function() {
            it('should open the modal for product search', function() {
                spyOn(uibModal, 'open').and.callThrough();
                productsService.Search();
                expect(uibModal.open).toHaveBeenCalledWith({
                    backdrop:'static',
                    templateUrl:'common/services/oc-products/productSearch.modal.html',
                    controller: 'ProductSearchModalCtrl',
                    controllerAs: '$ctrl',
                    size: '-full-screen c-productsearch-modal',
                    resolve: {
                        CatalogID: jasmine.any(Function)
                    }
                })
            });
        });
    });

describe('Controller: ProductSearchModalCtrl', function() {
    var productSearchModalCtrl,
        catalogID,
        uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
    beforeEach(inject(function($controller) {
        catalogID = mock.Buyer.DefaultCatalogID;
        productSearchModalCtrl = $controller('ProductSearchModalCtrl', {
            $uibModalInstance: uibModalInstance,
            $scope: scope,
            CatalogID: catalogID
        });
    }));
    describe('vm.getSearchResults', function() {
        beforeEach(function() {
            spyOn(oc.Me, 'ListProducts').and.returnValue(dummyPromise);
            productSearchModalCtrl.getSearchResults();
        });
        it('should get a list of products relative to the search term', function() {
            mock.Parameters = {
                catalogID: catalogID,
                search: productSearchModalCtrl.searchTerm,
                page: 1,
                pageSize: 5,
                depth: 'all'
            };
            expect(oc.Me.ListProducts).toHaveBeenCalledWith(mock.Parameters);
        });
    });
    describe('vm.cancel', function() {
        it('should dismiss the modal', function(){
            productSearchModalCtrl.cancel();
            expect(uibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
    describe('vm.onSelect', function() {
        it('should close the modal with the productID', function() {
            var productID;
            productSearchModalCtrl.onSelect();
            expect(uibModalInstance.close).toHaveBeenCalledWith({productID: productID});
        })
    });
    describe('vm.onHardEnter', function() {
        it('should close the modal on hard enter with the search term', function() {
            var searchTerm;
            productSearchModalCtrl.onHardEnter();
            expect(uibModalInstance.close).toHaveBeenCalledWith({search: searchTerm});
        })
    })
});