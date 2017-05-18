angular.module('orderCloud')
    .controller('ApprovalModalCtrl', ApprovalModalController)
;

function ApprovalModalController(OrderID, Intent, $exceptionHandler, $uibModalInstance, OrderCloudSDK, toastr){
    var vm = this;
    vm.intent = Intent; // 'Approve' or 'Decline'
    vm.orderid = OrderID;
    vm.comments = null;
    
    vm.cancel = cancel;
    vm.submit = submit;

    function cancel(){
        return $uibModalInstance.dismiss();
    }

    function submit(){
        return OrderCloudSDK.Orders[vm.intent]('outgoing', vm.orderid, {comments: vm.comments})
            .then(function(){
                $uibModalInstance.close();
            })
            .catch(function(ex){
                $exceptionHandler(ex);
            });
    }
}