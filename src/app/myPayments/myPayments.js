angular.module('orderCloud')
    .config(MyPaymentsConfig)
    .controller('MyPaymentsCtrl', MyPaymentsController)
;

function MyPaymentsConfig($stateProvider) {
    $stateProvider
        .state('myPayments', {
            parent: 'account',
            url: '/payments',
            templateUrl: 'myPayments/templates/myPayments.tpl.html',
            controller: 'MyPaymentsCtrl',
            controllerAs: 'myPayments',
            data: {
                pageTitle: "Payment Methods"
            },
            resolve: {
                UserCreditCards: function(OrderCloud) {
                    return OrderCloud.Me.ListCreditCards(null, null, null, null, null, {'Editable':true});
                },
                UserSpendingAccounts: function(OrderCloud) {
                   return OrderCloud.Me.ListSpendingAccounts(null, null, null, null, null, {'RedemptionCode': '!*'});
                },
                GiftCards: function(OrderCloud) {
                    return OrderCloud.Me.ListSpendingAccounts(null, null, null,null, null, {'RedemptionCode': '*'});
                }
            }
        });
}

function MyPaymentsController($q, $state, toastr, $exceptionHandler, ocConfirm, ocAuthNet, MyPaymentCreditCardModal, UserCreditCards, UserSpendingAccounts, GiftCards) {
    var vm = this;
    vm.personalCreditCards =  UserCreditCards;
    vm.personalSpendingAccounts = UserSpendingAccounts;
    vm.giftCards = GiftCards;

    vm.createCreditCard = function(){
        MyPaymentCreditCardModal.Create()
        .then(function() {
            toastr.success('Credit Card Created', 'Success');
            $state.reload('myPayments');
        });
    };

    vm.edit = function(creditCard){
        MyPaymentCreditCardModal.Edit(creditCard)
            .then(function(){
                toastr.success('Credit Card Updated', 'Success');
                $state.reload('myPayments');
            });
    };

    vm.delete = function(creditCard){

        ocConfirm.Confirm("Are you sure you want to delete this Credit Card?")
            .then(function(){
                var df = $q.defer();
                df.templateUrl = 'common/templates/view.loading.tpl.html';
                df.message = 'Deleting Selected Credit Card';
                vm.loading = df;

                ocAuthNet.DeleteCreditCard(creditCard)
                    .then(function(){
                        toastr.success('Credit Card Deleted', 'Success');
                        df.resolve();
                        $state.reload('myPayments');
                    })
                    .catch(function(error) {
                        $exceptionHandler(error);
                    });
            });
    };
}