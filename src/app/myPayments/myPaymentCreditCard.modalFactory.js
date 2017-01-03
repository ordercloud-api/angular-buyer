angular.module('orderCloud')
    .factory('MyPaymentCreditCardModal', MyPaymentCreditCardModalFactory)
    .controller('CreateCreditCardModalCtrl', CreateCreditCardModalController)
    .controller('EditCreditCardModalCtrl', EditCreditCardModalController)
;

function MyPaymentCreditCardModalFactory($uibModal) {
    return {
        Create: _create,
        Edit: _edit
    };

    function _create() {
        return $uibModal.open({
            templateUrl: 'myPayments/templates/myPaymentsCreditCard.create.modal.tpl.html',
            controller: 'CreateCreditCardModalCtrl',
            controllerAs: 'createCreditCard',
            size: 'md'
        }).result;
    }

    function _edit(creditCard) {
        var creditCardCopy = angular.copy(creditCard);
        return $uibModal.open({
            templateUrl: 'myPayments/templates/myPaymentsCreditCard.edit.modal.tpl.html',
            controller: 'EditCreditCardModalCtrl',
            controllerAs: 'editCreditCard',
            size: 'md',
            resolve: {
                SelectedCreditCard: function() {
                    return creditCardCopy;
                }
            }
        }).result;
    }
}

function CreateCreditCardModalController($q, $exceptionHandler, $uibModalInstance, creditCardUtility, AuthorizeNet) {
    var vm = this;
    vm.creditCardInfo = creditCardUtility;
    vm.creditCard = {};

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    vm.submit = function() {
        //loading indicator promise
        var df = $q.defer();
        df.templateUrl = 'common/loading-indicators/templates/view.loading.tpl.html';
        df.message = 'Creating Credit Card';
        vm.loading = df;
        AuthorizeNet.CreateCreditCard(vm.creditCard)
            .then(function(data){
                df.resolve();
                $uibModalInstance.close(data.ResponseBody);
            })
            .catch(function(error){
                $exceptionHandler(error);
            });
    };
}

function EditCreditCardModalController($q, $exceptionHandler, $uibModalInstance,  creditCardUtility, AuthorizeNet, SelectedCreditCard) {
    var vm = this;
    vm.creditCardInfo = creditCardUtility;
    vm.creditCard = SelectedCreditCard;
    var date = new Date(vm.creditCard.ExpirationDate);
    vm.creditCard.ExpirationMonth  = (date.toISOString().substring(5,7));
    vm.creditCard.ExpirationYear =  date.getFullYear();

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    vm.submit = function() {
        //loading indicator promise
        var df =  $q.defer();
        df.templateUrl = 'common/loading-indicators/templates/view.loading.tpl.html';
        df.message = 'Editing Credit Card';
        vm.loading = df;

        AuthorizeNet.UpdateCreditCard(vm.creditCard)
            .then(function(data){
                df.resolve();
                $uibModalInstance.close(data.ResponseBody);
            })
            .catch(function(error){
                $exceptionHandler(error);
            });
    };
}
