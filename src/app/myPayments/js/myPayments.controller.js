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
            toastr.success('Credit Card Created', 'Success');
            vm.personalCreditCards.Items.push(data);
        });
    };

    vm.edit = function(scope){
        ocMyCreditCards.Edit(scope.creditCard)
            .then(function(data){
                toastr.success('Credit Card Updated', 'Success');
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
                        toastr.success('Credit Card Deleted', 'Success');
                        vm.personalCreditCards.Items.splice(scope.$index, 1);
                    })
                    .catch(function(error) {
                        $exceptionHandler(error);
                    });
            });
    };
}