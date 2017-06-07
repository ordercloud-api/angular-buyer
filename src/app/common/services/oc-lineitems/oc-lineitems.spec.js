describe('Service: ocLineItems', function() {
    var ocLineItemsService;
    beforeEach(inject(function(ocLineItems) {
        ocLineItemsService = ocLineItems;
    }));
    
    describe('Method: SpecConvert(specs)', function() {
        var specModel;
        beforeEach(function(){
            specModel = {
                ID: 123,
                Value: 'RED',
                DefaultValue: 'BLUE',
                OptionID: 'ORANGE',
                DefaultOptionID: 'BLACK',
                Options: []
            };
            spyOn(ocLineItemsService, 'SpecConvert').and.callThrough();
        })
        describe('when there are no spec options', function(){
            it('it should only include SpecID and Value', function(){
                var expected = [{
                    SpecID: specModel.ID,
                    Value: specModel.Value
                }]
                expect(ocLineItemsService.SpecConvert([specModel])).toEqual(expected);
            });
            it('should use default value if value does not exist', function(){
                delete specModel.Value;
                var expected = [{
                    SpecID: specModel.ID,
                    Value: specModel.DefaultValue
                }]
                expect(ocLineItemsService.SpecConvert([specModel])).toEqual(expected);
            });
        });
        describe('when there are spec options', function(){
            var expected;
            beforeEach(function(){
                specModel.Options = ['MockOptions'];
                expected = [{
                    SpecID: specModel.ID,
                    Value: specModel.Value,
                    OptionID: specModel.OptionID
                }]
            });
            it('should include option ID', function(){
                expect(ocLineItemsService.SpecConvert([specModel])).toEqual(expected);
            });
            it('should use default option id if there is no option id', function(){
                delete specModel.OptionID;
                expected[0].OptionID = specModel.DefaultOptionID;
                expect(ocLineItemsService.SpecConvert([specModel])).toEqual(expected);
            });
        });
    });

    describe('Method: AddItem', function(){
        beforeEach(function(){
            var dfd = q.defer();
            dfd.resolve(mock.LineItem);
            spyOn(ocLineItemsService, 'SpecConvert').and.callThrough();
            spyOn(oc.LineItems, 'Create').and.returnValue(dfd.promise);
            mock.LineItem.Specs = [{ID: 123, Value: 'RED', Options: []}]
        })
        it('should call LineItems create', function(){
            var li = {
                ProductID: mock.LineItem.ID,
                Quantity: mock.LineItem.Quantity,
                Specs: [{
                    SpecID: mock.LineItem.Specs[0].ID, 
                    Value: mock.LineItem.Specs[0].Value
                }],
                ShippingAddressID: null
            }
            ocLineItemsService.AddItem(mock.Order, mock.LineItem);
            expect(oc.LineItems.Create).toHaveBeenCalledWith('outgoing', mock.Order.ID, li)
        })
    });

    describe('Method: UpdateShipping', function(){
        var mockAddressID = 'abc123';
        var mockAddress = {
            Name: 'John',
            LastName: 'Smith',
            Street1: '404 Pleasant Lane',
            City: 'Des Moines',
            State: 'IA',
            Country: 'US'
        }
        beforeEach(function(){
            spyOn(oc.Me, 'GetAddress').and.returnValue(q.when(mockAddress));
            spyOn(oc.LineItems, 'SetShippingAddress');
            ocLineItemsService.UpdateShipping(mock.Order, mock.LineItem, mockAddressID)
        });
        it('should get current users address', function(){
            expect(oc.Me.GetAddress).toHaveBeenCalledWith(mockAddressID);
        })
        it('should set shipping address on the line item', function(){
            scope.$digest();
            expect(oc.LineItems.SetShippingAddress).toHaveBeenCalledWith('outgoing', mock.Order.ID, mock.LineItem.ID, mockAddress);
        })
    });

    describe('Method: ListAll', function(){
        it('should only call list more than once if there are additional pages of results', function(){
            var listCall = {Meta: {Page: 1, TotalPages: 1}, Items: [{ID: 'LI1'}]};
            spyOn(oc.LineItems, 'List').and.returnValue(q.when(listCall));
            ocLineItemsService.ListAll(mock.Order.ID);
            expect(oc.LineItems.List).toHaveBeenCalledWith('outgoing', mock.Order.ID, {page:1, pageSize: 100});
            expect(oc.LineItems.List).toHaveBeenCalledTimes(1);
        });
        it('should only continue calling list until there are no additional results', function(){
            pageOne = {Meta: {Page: 1, TotalPages: 2}, Items: mock.LI};
            pageTwo = {Meta: {Page: 2, TotalPages: 2}, Items: mock.LI};

            spyOn(oc.LineItems, 'List').and.returnValues(q.when(pageOne, q.when(pageTwo)));
            ocLineItemsService.ListAll(mock.Order.ID);
            scope.$digest();
            expect(oc.LineItems.List).toHaveBeenCalledTimes(2);
        })
    });
});