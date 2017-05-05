angular.module('orderCloud')
    .controller('MyPaymentsCtrl', MyPaymentsController)
;

function MyPaymentsController($q, $state, toastr, $exceptionHandler, ocConfirm, ocAuthNet, ocMyCreditCards, UserCreditCards, UserSpendingAccounts, GiftCards) {
    var vm = this;
    vm.personalCreditCards =  UserCreditCards;
    vm.personalSpendingAccounts = UserSpendingAccounts;
    vm.giftCards = GiftCards;

    vm.createCreditCard = function(){
        ocMyCreditCards.Create()
        .then(function(data) {
            toastr.success('Credit card ending in ' + data.PartialAccountNumber + ' was saved.');
            vm.personalCreditCards.Items.push(data);
        });
    };

    vm.edit = function(scope){
        ocMyCreditCards.Edit(scope.creditCard)
            .then(function(data){
            toastr.success('Credit card ending in ' + data.PartialAccountNumber + ' was updated.');
                vm.personalCreditCards.Items[scope.$index] = data;
            });
    };

    vm.delete = function(scope){
        vm.loading = [];
        ocConfirm.Confirm({
                message:'Are you sure you want to delete <br> <b>' + 'xxxx-xxxx-xxxx-' + scope.creditCard.PartialAccountNumber + '</b>?',
                confirmText: 'Delete credit card',
                type: 'delete'})
            .then(function(){
                vm.loading[scope.$index] = ocAuthNet.DeleteCreditCard(scope.creditCard)
                    .then(function(){
                        toastr.success('Credit card ending in ' + scope.creditCard.PartialAccountNumber + ' was deleted.');
                        vm.personalCreditCards.Items.splice(scope.$index, 1);
                    })
                    .catch(function(error) {
                        $exceptionHandler(error);
                    });
            });
    };
}