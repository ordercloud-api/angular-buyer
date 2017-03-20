describe('Component: orderApprovals', function() {
    var scope,
        q,
        oc,
        _ocApprovals,
        mockOrderID,
        mockBuyerID,
        mockCurrentUser,
        stateParams
        ;
    beforeEach(module(function($provide) {
        mockCurrentUser = {FirstName: 'JohnSmith', ID: 'JohnSmith123'};
        mockOrderID = 'OrderID123';
        mockBuyerID = 'Buyer123';
        stateParams =  {buyerid: mockBuyerID, orderid: mockOrderID};
        $provide.value('CurrentUser', mockCurrentUser);
    }));
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope, OrderCloud, ocParameters, ocApprovals) {
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloud;
        _ocApprovals = ocApprovals;
    }));



    describe('State: orderDetail.approvals', function() {
        var state
            ;
        beforeEach(inject(function($state, $stateParams) {
            $stateParams.orderid = stateParams.orderid;
            $stateParams.buyerid = stateParams.buyerid;
            state = $state.get('orderDetail.approvals');

            var mockUserList = {Meta: 'mockMeta', Items: [{Username: 'test1', ID: 1}, {Username: 'test2', ID: 2}]};
            var defer = q.defer();
            defer.resolve(mockUserList);
            
            spyOn(_ocApprovals, 'List');
            spyOn(oc.Orders, 'ListEligibleApprovers').and.returnValue(defer.promise);
        }));
        it('should resolve OrderApprovals', inject(function($injector){
            $injector.invoke(state.resolve.OrderApprovals);
            expect(_ocApprovals.List).toHaveBeenCalledWith(mockOrderID, mockBuyerID, 1, 100);
        }));
        it('should resolve CanApprove', inject(function($injector) {
            $injector.invoke(state.resolve.CanApprove);
            expect(oc.Orders.ListEligibleApprovers).toHaveBeenCalledWith(mockOrderID, null, 1, 100);
        }));
    });



    describe('Controller: OrderApprovalsCtrl', function(){
        var orderApprovalsCtrl,
            mockMeta,
            mockResponse
        ;
        beforeEach(inject(function($controller, $stateParams){
            $stateParams = stateParams;
            mockMeta = {Page: 2, PageSize: 15};
            mockResponse = {Items: [{ApprovalRuleID: 'Approval2', Status: 'Declined'}, {ApprovalRuleID: 'Approval3', Status: 'Pending'}], Meta: mockMeta};

            orderApprovalsCtrl = $controller('OrderApprovalsCtrl', {
                $stateParams: $stateParams,
                OrderCloud: oc,
                ocApprovals: _ocApprovals,
                OrderApprovals: {Meta: {Page: 1, PageSize: 12}, Items: [{ApprovalRuleID: 'Approval1', Status: 'Approved'}] },
                CanApprove: true
            });

            var defer = q.defer();
            defer.resolve(mockResponse);
            spyOn(_ocApprovals, 'List').and.returnValue(defer.promise);
            spyOn(_ocApprovals, 'UpdateApprovalStatus');
        }));


        describe('pageChanged', function(){
            it('should update results with page from vm.list.Meta.Page', function(){
                var mockPage = 3;
                orderApprovalsCtrl.list.Meta.Page = mockPage;
                orderApprovalsCtrl.pageChanged();
                expect(_ocApprovals.List).toHaveBeenCalledWith(mockOrderID, mockBuyerID, mockPage, 12);
                scope.$digest();
                expect(orderApprovalsCtrl.list).toEqual(mockResponse);
            });
        });


        describe('loadMore', function(){
            it('should concatenate next page of results with current list items', function(){
                var nextPage = orderApprovalsCtrl.list.Meta.Page + 1;
                orderApprovalsCtrl.loadMore();
                expect(_ocApprovals.List).toHaveBeenCalledWith(mockOrderID, mockBuyerID, nextPage, 12);
                scope.$digest();
                expect(orderApprovalsCtrl.list.Meta.Page).toBe(nextPage);
                expect(orderApprovalsCtrl.list.Items).toEqual([{ApprovalRuleID: 'Approval1', Status: 'Approved'}, {ApprovalRuleID: 'Approval2', Status: 'Declined'}, {ApprovalRuleID: 'Approval3', Status: 'Pending'}]);
            });
        });


        describe('updateApprovalStatus', function(){
            it('should call ocApprovals.UpdateApprovalStatus', function(){
                var intent = 'Approve';
                orderApprovalsCtrl.updateApprovalStatus(intent);
                expect(_ocApprovals.UpdateApprovalStatus).toHaveBeenCalledWith(mockOrderID, intent);
            });
        });
    });


    describe('Controller: OrderApprovalsCtrl', function(){
        var approvalModalCtrl,
            exceptionHandler,
            uibModal,
            toaster
        ;
        beforeEach(inject(function($controller, $stateParams, $exceptionHandler, toastr){
            var intent = 'Approve';
            exceptionHandler = $exceptionHandler,
            uibModal = jasmine.createSpyObj('modalInstance', ['close', 'dismiss', 'result.then']);
            toaster = toastr;

            approvalModalCtrl = $controller('ApprovalModalCtrl', {
                OrderID: mockOrderID,
                Intent: intent,
                $exceptionHandler: exceptionHandler,
                $uibModalInstance: uibModal,
                toastr: toaster
            });

            var defer = q.defer();
            defer.resolve();
            spyOn(toastr, 'success');
            spyOn(oc.Orders, 'Approve').and.returnValue(defer.promise);
            spyOn(oc.Orders, 'Decline').and.returnValue(defer.promise);
        }));


        describe('cancel', function(){
            it('should dismiss modal', function(){
                approvalModalCtrl.cancel();
                expect(uibModal.dismiss).toHaveBeenCalled();
            });
        });

        describe('submit', function(){
            it('should call OrderCloud.Orders.Submit if intent is set to "Submit"', function(){
                approvalModalCtrl.intent = 'Approve';
                approvalModalCtrl.submit(); 
                expect(oc.Orders.Approve).toHaveBeenCalledWith(mockOrderID, null);
            });
            it('should call OrderCloud.Orders.Decline if intent is set to "Decline"', function(){
                approvalModalCtrl.intent = 'Decline';
                approvalModalCtrl.submit();
                expect(oc.Orders.Decline).toHaveBeenCalledWith(mockOrderID, null);
            });
            it('should allow user to enter comments when approving', function(){
                var mockComments = 'Approval worked';
                approvalModalCtrl.intent = 'Approve';
                approvalModalCtrl.comments = mockComments;
                approvalModalCtrl.submit(); 
                expect(oc.Orders.Approve).toHaveBeenCalledWith(mockOrderID, mockComments);
            });
            it('should allow user to enter comments when declining', function(){
                var mockComments = 'Decline worked';
                approvalModalCtrl.intent = 'Decline';
                approvalModalCtrl.comments = mockComments;
                approvalModalCtrl.submit(); 
                expect(oc.Orders.Decline).toHaveBeenCalledWith(mockOrderID, mockComments);
            });
        });
    });
});