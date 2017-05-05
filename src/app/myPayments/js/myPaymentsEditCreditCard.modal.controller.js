angular.module('orderCloud')
    .controller('EditCreditCardModalCtrl', EditCreditCardModalController)
;

function EditCreditCardModalController($q, $exceptionHandler, $uibModalInstance,  ocCreditCardUtility, ocAuthNet, SelectedCreditCard) {
    var vm = this;
    vm.creditCardInfo = ocCreditCardUtility;
    vm.creditCard = SelectedCreditCard;
    var date = new Date(vm.creditCard.ExpirationDate);
    vm.creditCard.ExpirationMonth  = (date.toISOString().substring(5,7));
    vm.creditCard.ExpirationYear =  date.getFullYear();
    //vm.creditCard.ExpirationDate = date.getMonth() + "/" + date.getFullYear();

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    vm.submit = function() {
        //loading indicator promise
        vm.loading = {
            message: 'Editing Credit Card'
        };
        vm.loading.promise = ocAuthNet.UpdateCreditCard(vm.creditCard)
            .then(function(data){
                $uibModalInstance.close(data.ResponseBody);
            })
            .catch(function(error){
                $exceptionHandler(error);
            });
    };
}