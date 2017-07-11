describe('Service: ocConfirm', function() {
    describe('Factory: ocConfirm', function() {
        it('should define the methods', function() {
            expect(ocConfirmService.Confirm).toBeDefined();
            expect(ocConfirmService.Confirm).toEqual(jasmine.any(Function));
        });
        describe('Method: Confirm', function() {
            it('should open the modal for the confirmation template', function() {
                var confirmOptions = {
                    Size: 'sm'
                };
                var defer = q.defer();
                defer.resolve(confirmOptions);
                spyOn(uibModalService, 'open').and.returnValue(defer.promise);
                ocConfirmService.Confirm(confirmOptions);
                expect(uibModalService.open).toHaveBeenCalledWith({
                    backdrop:'static',
                    templateUrl: 'common/services/oc-confirm/oc-confirm.modal.html',
                    controller: 'ConfirmModalCtrl',
                    controllerAs: 'confirmModal',
                    size: 'confirm',
                    resolve: {
                        ConfirmOptions: jasmine.any(Function)
                    }
                })
            });
        });
    });

    describe('Controller: ConfirmModalCtrl', function() {
        var confirmModalCtrl,
            confirmOptions = {
                message: 'confirm message',
                confirmText: 'confirm text',
                cancelText: 'cancel text',
                type: 'type'
            },
            uibModalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
        beforeEach(inject(function($controller) {
            confirmModalCtrl = $controller('ConfirmModalCtrl', {
                ConfirmOptions: confirmOptions,
                $uibModalInstance: uibModalInstance
            });
        }));
        describe('vm.confirm', function() {
            it('should close the modal', function() {
                confirmModalCtrl.confirm();
                expect(uibModalInstance.close).toHaveBeenCalled();
            })
        })
        describe('vm.cancel', function() {
            it('should dismiss the modal', function() {
                confirmModalCtrl.cancel();
                expect(uibModalInstance.dismiss).toHaveBeenCalled();
            })
        })
    });
});