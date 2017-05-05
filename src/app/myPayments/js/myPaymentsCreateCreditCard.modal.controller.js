angular.module('orderCloud')
    .controller('CreateCreditCardModalCtrl', CreateCreditCardModalController)
;

function CreateCreditCardModalController($q, $exceptionHandler, $uibModalInstance, ocCreditCardUtility, ocAuthNet) {
    var vm = this;
    vm.creditCardInfo = ocCreditCardUtility;
    vm.creditCard = {};

    vm.cancel = function() {
        $uibModalInstance.dismiss();
    };

    vm.submit = function() {
        vm.loading = {
            message: 'Creating Credit Card'
        };

		// vm.creditCard.ExpirationMonth  = vm.creditCard.ExpirationDate.split('/')[0];
		// vm.creditCard.ExpirationYear =  vm.creditCard.ExpirationDate.split('/')[1];

        vm.loading.promise = ocAuthNet.CreateCreditCard(vm.creditCard)
            .then(function(data){
                $uibModalInstance.close(data.ResponseBody);
            })
            .catch(function(error){
                $exceptionHandler(error);
            });
    };
}