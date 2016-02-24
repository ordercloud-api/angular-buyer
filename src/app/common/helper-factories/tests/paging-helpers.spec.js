describe('Factory: Paging', function() {
    var scope,
        paging,
        listArray,
        assignmentsArray,
        oc;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module('ordercloud-paging-helpers'));
    beforeEach(inject(function($rootScope, Paging, OrderCloud) {
        listArray = [{ID: 1}, {ID: 2}, {ID: 3}];
        assignmentsArray = [{ID: 2}, {ID: 3}];
        scope = $rootScope.$new();
        paging= Paging;
        oc = OrderCloud;
    }));
    it('setSelected should create or update a selected property on the first array if it also exists in the second assignments array', function() {
        paging.setSelected(listArray, assignmentsArray, 'ID');
        expect(listArray).toEqual([{ID: 1}, {ID: 2, selected: true}, {ID: 3, selected: true}])
    });
    describe('pagingFunction', function() {
        var serviceName, service,
            objectList,
            objectAssignmentsList,
            assignFunc;
        beforeEach(function() {
            serviceName = 'Products';
            objectList = {
                Meta: {
                    Page: 1,
                    TotalPages: 2,
                    PageSize: 20
                },
                Items: listArray
            };
            objectAssignmentsList = {
                Meta: {
                    Page: 1,
                    TotalPages: 2,
                    PageSize: 20
                },
                Items: assignmentsArray
            };
            assignFunc = function() {
                return service.ListAssignments();
            };
            service = oc[serviceName];
            spyOn(service, 'List').and.returnValue(objectList);
            spyOn(service, 'ListAssignments').and.returnValue(objectAssignmentsList);
        });
        it('should call the List method of the service passed in if page is less than total pages', function() {
            paging.paging(objectList, serviceName);
            scope.$digest();
            expect(service.List).toHaveBeenCalledWith(null, objectList.Meta.Page + 1, objectList.Meta.PageSize)
        });
        it('should not call the List method of the service if pages is greater than or equal to total pages', function() {
            objectList.Meta.Page = 2;
            paging.paging(objectList, serviceName);
            scope.$digest();
            expect(service.List).not.toHaveBeenCalledWith(null, objectList.Meta.Page + 1, objectList.Meta.PageSize)
        });

        it('should call the ListAssignments method of the service passed in if page is less than total pages', function() {
            paging.paging(objectList, serviceName, objectAssignmentsList, assignFunc);
            scope.$digest();
            expect(service.ListAssignments).toHaveBeenCalled()
        });
        it('should not call the List method of the service if pages is greater than or equal to total pages', function() {
            objectAssignmentsList.Meta.Page = 2;
            paging.paging(objectList, serviceName, objectAssignmentsList, assignFunc);
            scope.$digest();
            expect(service.ListAssignments).not.toHaveBeenCalled()
        });
    });
});