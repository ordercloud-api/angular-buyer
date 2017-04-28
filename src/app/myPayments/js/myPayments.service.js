angular.module('orderCloud')
    .factory('ocMyCreditCards', OrderCloudMyCreditCardsService)
;

function OrderCloudMyCreditCardsService($uibModal) {
    return {
        Create: _create,
        Edit: _edit
    };

    function _create() {
        return $uibModal.open({
            templateUrl: 'myPayments/templates/myPaymentsCreditCard.create.modal.html',
            controller: 'CreateCreditCardModalCtrl',
            controllerAs: 'createCreditCard',
            size: 'md'
        }).result;
    }

    function _edit(creditCard) {
        var creditCardCopy = angular.copy(creditCard);
        return $uibModal.open({
            templateUrl: 'myPayments/templates/myPaymentsCreditCard.edit.modal.html',
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