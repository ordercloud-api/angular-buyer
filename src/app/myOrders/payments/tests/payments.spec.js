describe('Component: Payments', function() {

    var _ocOrderPayments;
    beforeEach(inject(function(ocOrderPayments, buyerid) {
        _ocOrderPayments = ocOrderPayments;
        mock.Buyer.ID = buyerid;
    }));

    describe('State: orderDetail.payments', function() {
        var orderPaymentsState;
        beforeEach(inject(function($stateParams) {
            orderPaymentsState = state.get('orderDetail.payments');
            mock.Order.ID = $stateParams.orderid;
            spyOn(_ocOrderPayments, 'List');
        }));
        it('should resolve OrderPayments', function() {
            injector.invoke(orderPaymentsState.resolve.OrderPayments);
            expect(_ocOrderPayments.List).toHaveBeenCalledWith(mock.Order.ID, mock.Buyer.ID, 1, null);
        })
    });

    describe('Controller: OrderPaymentsCtrl', function() {
        var orderPaymentsCtrl,
            orderPayments;
        beforeEach(inject(function($controller, OrderPayments) {
            orderPayments = OrderPayments;
            orderPaymentsCtrl = $controller('OrderPaymentsCtrl', {
                List: {
                    Items: ['mockPayment1', 'mockPayment2'],
                    Meta: {
                        Page: 1,
                        PageSize: 100
                    }
                },
                OrderPayments: orderPayments
            });
            spyOn(_ocOrderPayments, 'List');
        }));
        describe('vm.pageChanged', function() {
            it('should update the page on Meta', function(){
                var page = orderPaymentsCtrl.List.Meta.Page;
                var pageSize = orderPaymentsCtrl.List.Meta.PageSize;
                orderPaymentsCtrl.pageChanged();
                expect(_ocOrderPayments.List).toHaveBeenCalledWith(mock.Order.ID, mock.Buyer.ID, page, pageSize);
            });
        });
        describe('vm.loadMore', function() {
            it('should increase the pageSize on Meta', function() {
                var page = orderPaymentsCtrl.List.Meta.Page;
                var pageSize = orderPaymentsCtrl.List.Meta.PageSize + 1;
                orderPaymentsCtrl.loadMore();
                expect(_ocOrderPayments.List).toHaveBeenCalledWith(mock.Order.ID, mock.Buyer.ID, page, pageSize);
            });
        });
    });

    describe('Factory: ocOrderPayments', function() {
        var page,
            pageSize;
        it('should define methods', function(){
            expect(_ocOrderPayments.List).toBeDefined();
            expect(_ocOrderPayments.List).toEqual(jasmine.any(Function));
        });
        describe('Method: List', function() {
            beforeEach(function() {
                var defer = q.defer();
                defer.resolve({Items: [{Type: 'SpendingAccount', SpendingAccountID: 'testSA_ID'}]});
                spyOn(oc.Payments, 'List').and.returnValue(defer.promise);
                spyOn(oc.Me, 'GetSpendingAccount');

                _ocOrderPayments.List();
            });
            it('should return a list of payments from the order', function() {
                var direction = 'outgoing',
                    orderID;
                expect(oc.Payments.List).toHaveBeenCalledWith(direction, orderID, {page: page, pageSize: pageSize});
            });
            it('if payment type is spending account, should get a spending account from the ME endpoint', function() {
                scope.$digest();
                expect(oc.Me.GetSpendingAccount).toHaveBeenCalledWith('testSA_ID');
            });
        });
        describe('Method: List', function() {
            beforeEach(function() {
                var defer = q.defer();
                defer.resolve({Items: [{Type: 'CreditCard', CreditCardID: 'testCC_ID'}]});
                spyOn(oc.Payments, 'List').and.returnValue(defer.promise);
                spyOn(oc.Me, 'GetCreditCard');

                _ocOrderPayments.List();
            });
            it('should return a list of payments from the order', function() {
                var direction = 'outgoing',
                    orderID;
                expect(oc.Payments.List).toHaveBeenCalledWith(direction, orderID, {page: page, pageSize: pageSize});
            });
            it('if payment type is credit card, should get a credit card from the ME endpoint', function() {
                scope.$digest();
                expect(oc.Me.GetCreditCard).toHaveBeenCalledWith('testCC_ID');
            });
        });
    })
});