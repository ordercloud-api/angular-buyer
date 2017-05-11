describe('Component: ProductBrowse', function () {

    var _ocProductBrowse;
    beforeEach(inject(function (ocProductBrowse) {
        _ocProductBrowse = ocProductBrowse;
    }))

    describe('State: productBrowse', function () {
        var productBrowseState,
            catalogID;
        beforeEach(inject(function (catalogid) {
            productBrowseState = state.get('productBrowse');
            catalogID = catalogid;
            spyOn(ocParametersService, 'Get');
            spyOn(oc.Me, 'ListCategories').and.returnValue(null);
        }));
        it('should resolve Parameters', function () {
            injector.invoke(productBrowseState.resolve.Parameters);
            expect(ocParametersService.Get).toHaveBeenCalled();
        });
        it('should resolve CategoryList', function () {
            var parameters = {
                depth: 'all',
                catalogID: catalogID,
                page: 1,
                pageSize: 100
            };
            injector.invoke(productBrowseState.resolve.CategoryList);
            expect(oc.Me.ListCategories).toHaveBeenCalledWith(parameters);
        });
    });

    describe('State: productBrowse.products', function () {
        var productsState;
        beforeEach(function () {
            productsState = state.get('productBrowse.products');
            spyOn(ocParametersService, 'Get');
            spyOn(oc.Me, 'ListProducts').and.returnValue(null);
        });
        it('should resolve Parameters', function () {
            injector.invoke(productsState.resolve.Parameters);
            expect(ocParametersService.Get).toHaveBeenCalled();
        });
        it('should resolve ProductList', function () {
            injector.invoke(productsState.resolve.ProductList);
            expect(oc.Me.ListProducts).toHaveBeenCalledWith(mock.Parameters);
        });
    });

    describe('Controller: ProductBrowseCtrl', function () {
        var productBrowseCtrl;
        beforeEach(inject(function ($controller) {
            productBrowseCtrl = $controller('ProductBrowseCtrl', {
                CategoryList: {
                    Items: [],
                    Meta: {
                        Page: 1,
                        PageSize: 12
                    }
                },
                CategoryTree: {}
            })
            spyOn(state, 'go');
            spyOn(_ocProductBrowse, 'OpenCategoryModal').and.returnValue(dummyPromise);
        }));
        describe('vm.toggleFavorites', function () {
            it('should reload the state with new parameters', function () {
                mock.Parameters.favorites = true;
                mock.Parameters.page = '';
                productBrowseCtrl.toggleFavorites();
                expect(state.go).toHaveBeenCalledWith('productBrowse.products', ocParametersService.Create(mock.Parameters));
            });
        });
        describe('vm.openCategoryModal', function () {
            it('should call the ocProductBrowse OpenCategoryModal service method', function () {
                var categoryID;
                productBrowseCtrl.openCategoryModal();
                expect(_ocProductBrowse.OpenCategoryModal).toHaveBeenCalledWith(productBrowseCtrl.treeConfig);
                scope.$digest();
                expect(state.go).toHaveBeenCalledWith('productBrowse.products', {
                    categoryid: categoryID,
                    page: ''
                });
            })
        })
    });

    describe('Controller: ProductViewCtrl', function () {
        var productViewCtrl,
            ocMedia;
        beforeEach(inject(function ($controller, $ocMedia) {
            ocMedia = $ocMedia;
            productViewCtrl = $controller('ProductViewCtrl', {
                ProductList: {
                    Items: [],
                    Meta: {
                        Page: 1,
                        PageSize: 12
                    }
                },
                CategoryList: {
                    Items: [],
                    Meta: {
                        Page: 1,
                        PageSize: 12
                    }
                }
            });

            spyOn(productViewCtrl, 'filter');
            spyOn(state, 'go');
        }));
        describe('vm.reverseSort', function () {
            it('should reload state with a reverse sort call', function () {
                mock.Parameters.sortBy = '!ID';
                productViewCtrl.reverseSort();
                expect(productViewCtrl.filter).toHaveBeenCalledWith(false);
            })
        });
        describe('vm.pageChanged', function () {
            it('should reload state with the new page', function () {
                productViewCtrl.pageChanged();
                expect(state.go).toHaveBeenCalledWith('.', {
                    page: productViewCtrl.list.Meta.Page
                });
            });
        });
        describe('vm.loadMore', function () {
            beforeEach(function () {
                productViewCtrl.list = {
                    Items: [mock.Product, mock.Product],
                    Meta: {
                        Page: 1,
                        PageSize: 12
                    }
                }
                spyOn(oc.Me, 'ListProducts').and.returnValue(dummyPromise);
                productViewCtrl.loadMore();
            });
            it('should call the Me ListProducts method', function () {
                expect(oc.Me.ListProducts).toHaveBeenCalledWith(mock.Parameters);
            });
        });
    });

    describe('Factory: ocProductBrowse', function () {
        var uibModal;
        beforeEach(inject(function ($uibModal) {
            uibModal = $uibModal;
        }));
        describe('Method: OpenCategoryModal', function () {
            it('should open the modal for mobile category dropdown', function () {
                var treeConfig = {};
                var defer = q.defer();
                defer.resolve(treeConfig);
                spyOn(uibModal, 'open').and.returnValue(defer.promise);
                _ocProductBrowse.OpenCategoryModal();
                expect(uibModal.open).toHaveBeenCalledWith({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'productBrowse/templates/mobileCategory.modal.html',
                    controller: 'MobileCategoryModalCtrl',
                    controllerAs: 'mobileCategoryModal',
                    size: '-full-screen',
                    resolve: {
                        TreeConfig: jasmine.any(Function)
                    }
                });
            })
        })
    });

    describe('Controller: MobileCategoryModalCtrl', function() {
        var mobileCategoryModalCtrl,
            uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
        beforeEach(inject(function($controller) {
            mobileCategoryModalCtrl = $controller('MobileCategoryModalCtrl', {
                $uibModalInstance: uibModalInstance,
                TreeConfig: {}
            });
        }));
        describe('vm.cancel', function() {
            it('should dismiss the modal', function() {
                mobileCategoryModalCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            });
        });
        describe('vm.selectNode', function() {
            it('should close themodal with the node (category id)', function() {
                var node = {};
                mobileCategoryModalCtrl.selectNode(node);
                expect(uibModalInstance.close).toHaveBeenCalledWith(node);
            })
        });
    })
});