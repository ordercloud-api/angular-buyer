describe('Buyer-Select:', function() {
    var q,
        scope,
        oc;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope, OrderCloud){
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloud;
    }));

    describe('Directive: ordercloudSelectBuyer', function() {
        var element;
        beforeEach(inject(function($compile) {
            var deferred1 = q.defer();
            var deferred2 = q.defer();
            deferred1.resolve('Buyer');
            deferred2.resolve('Buyers');
            spyOn(oc.Buyers, 'Get').and.returnValue(deferred1.promise);
            spyOn(oc.Buyers, 'List').and.returnValue(deferred2.promise);
            element = $compile('<ordercloud-select-buyer></ordercloud-select-buyer>')(scope);
            scope.$digest();
        }));
        it('should initialize the controller', function() {
            expect(oc.Buyers.List).toHaveBeenCalled();
            expect(oc.Buyers.Get).toHaveBeenCalledWith(oc.BuyerID.Get());
            expect(element.isolateScope().selectBuyer).not.toBe(undefined);
        });
        it('should initialize a list of buyers', function() {
            expect(element.isolateScope().selectBuyer.BuyerList).toBe('Buyers');
        });
        it('should initialize a the selected buyer', function() {
            expect(element.isolateScope().selectBuyer.selectedBuyer).toBe('Buyer');
        });
        it('should initialize a list of buyers', function() {
            expect(element.isolateScope().selectBuyer.BuyerList).toBe('Buyers');
        });
    });

    describe('Controller: SelectBuyerCtrl', function() {
        var buyerSelectCtrl,
            mock_buyer = {
                ID: 'buyer_id',
                name: 'fake_buyer'
            },
            mock_list = {
                Meta: {
                    Page: 1,
                    TotalPages: 2,
                    PageSize: 1
                },
                Items: [
                    'buyer1',
                    'buyer2'
                ]
            };
        beforeEach(inject(function($controller, $state) {
            var deferred1 = q.defer();
            var deferred2 = q.defer();
            deferred1.resolve(mock_buyer);
            deferred2.resolve(mock_list);
            spyOn(oc.Buyers, 'Get').and.returnValue(deferred1.promise);
            spyOn(oc.Buyers, 'List').and.returnValue(deferred2.promise);
            spyOn($state, 'reload').and.returnValue(true);
            spyOn(oc.BuyerID, 'Set').and.returnValue(true);
            buyerSelectCtrl = $controller('SelectBuyerCtrl', {
                $scope: scope
            });
        }));
        describe('ChangeBuyer', function() {
            beforeEach(function() {
                buyerSelectCtrl.ChangeBuyer(mock_buyer);
                scope.$digest();
            });
            it('should called the Get method of the Buyers service', function() {
                expect(oc.Buyers.Get).toHaveBeenCalledWith(mock_buyer.ID);
            });
            it('should change the selected buyer to the one passed in', function() {
                expect(buyerSelectCtrl.selectedBuyer).toBe(mock_buyer);
            });
            it('should call the Set method of BuyerID to change the saved buyer ID value stored in the cookies', function() {
                expect(oc.BuyerID.Set).toHaveBeenCalledWith(mock_buyer.ID);
            });
            it('should reload the state', inject(function($state) {
                expect($state.reload).toHaveBeenCalledWith($state.current);
            }));
        });
        describe('pagingfunction', function() {
            beforeEach(function() {
                scope.$digest();
                buyerSelectCtrl.pagingfunction();
            });
            it('should call the List method of Buyers when there are more pages to get', function() {
                scope.$digest();
                expect(oc.Buyers.List).toHaveBeenCalledWith(null, mock_list.Meta.Page + 1, mock_list.Meta.PageSize);
                expect(buyerSelectCtrl.BuyerList.Items.length).toBe(4);
            });
            it('should not call the List method when there are no more pages to get', function() {
                buyerSelectCtrl.BuyerList.Meta.Page = 2;
                scope.$digest();
                expect(oc.Buyers.List).not.toHaveBeenCalledWith(null, mock_list.Meta.Page + 1, mock_list.Meta.PageSize);
            });
        });
    });
});
