angular.module('ordercloud-impersonation', [])

    .factory('ImpersonationService', ImpersonationService)
    .controller('BuyerUserSelectModalCtrl', ModalController)

;
//TODO: Consider removing
function ImpersonationService(ApiClients, $q, $rootScope, $uibModal, $state, Users, Auth, toastr) {
    return {
        DecryptToken: DecryptToken,
        Impersonation: Impersonation,
        StopImpersonating: StopImpersonating
    };

    function DecryptToken() {
        Auth.SetImpersonating(false);
        var token = Auth.GetToken().split('.');
        return JSON.parse(atob(token[1]));
    }

    function Impersonation(FunctionCall) {
        var dfd = $q.defer(),
            jwt = DecryptToken();
        if (jwt.type === 'Buyer') {
            dfd.resolve(FunctionCall());
        }
        else {
            if (jwt.role === 'FullAccess') {
                if (!Auth.GetImpersonating()) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'common/impersonation/templates/buyer-user-modal.tpl.html',
                        controller: 'BuyerUserSelectModalCtrl',
                        controllerAs: 'modalSelect',
                        size: 'lg',
                        resolve: {
                            UserList: function( Users) {
                                return Users.List();
                            }
                        }
                    });
                    modalInstance.result
                        .then(function(selectedUser) {
                            ApiClients.List()
                                .then(function(apiList) {
                                    Users.GetAccessToken(selectedUser.ID, {ClientID: apiList.Items[0].ID, Claims: ['FullAccess']})
                                        .then(function(token) {
                                            Auth.SetImpersonationToken(selectedUser.ID, token["access_token"]);
                                            Auth.SetImpersonating(true);
                                            $rootScope.$broadcast('ImpersonationStarted');
                                            dfd.resolve(FunctionCall());
                                        })
                                        .catch(function() {
                                            toastr.error('Could not set an impersonation token for the selected user.', 'Error:');
                                        });
                                })
                                .catch(function() {
                                    toastr.error("No buyer client ids found.", 'Error:');
                                });
                        })
                        .catch(function() {
                            $state.go('home');
                        });
                }
                else {
                    Auth.SetImpersonating(true);
                    dfd.resolve(FunctionCall());
                }
            }
            else {
                toastr.error("You do not have permission to impersonate a buyer user.", 'Error:');
            }
        }
        return dfd.promise;
    }

    function StopImpersonating() {
        Auth.ClearImpersonationToken();
        Auth.SetImpersonating(false);
        $rootScope.$broadcast('ImpersonationStopped');
        $state.go('home');
    }
}

function ModalController($uibModalInstance, $state, UserList) {
    var vm = this;
    vm.list = UserList;
    vm.selected = vm.list[0];

    vm.selectUser = function(index) {
        $uibModalInstance.close(vm.list.Items[index]);
    };

    vm.cancel = function() {
        $uibModalInstance.dismiss('cancel');
        $state.go('home');
    };
}
