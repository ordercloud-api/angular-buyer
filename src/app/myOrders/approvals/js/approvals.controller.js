angular.module('orderCloud')
    .controller('OrderApprovalsCtrl', OrderApprovalsController)
    .controller('ApprovalModalCtrl', ApprovalModalController)
;

function OrderApprovalsController($stateParams, ocApprovals, OrderApprovals, CanApprove) {
    var vm = this;
    vm.list = OrderApprovals;
    vm.canApprove = CanApprove;

    vm.pageChanged = function() {
        ocApprovals.List($stateParams.orderid, $stateParams.buyerid, vm.list.Meta.Page, vm.list.Meta.PageSize)
            .then(function(data) {
                vm.list = data;
            });
    };

    vm.loadMore = function() {
        vm.list.Meta.Page++;
        ocApprovals.List($stateParams.orderid, $stateParams.buyerid, vm.list.Meta.Page, vm.list.Meta.PageSize)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };

    vm.updateApprovalStatus = function(intent){
        //intent is a string either 'Approve' or 'Decline'
        return ocApprovals.UpdateApprovalStatus($stateParams.orderid, intent);
    };
}

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
                toastr.success('Order ' + vm.intent.toLowerCase() + 'd');
                $uibModalInstance.close();
            })
            .catch(function(ex){
                $exceptionHandler(ex);
            });
    }
}