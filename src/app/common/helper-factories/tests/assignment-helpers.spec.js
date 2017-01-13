describe('Factory: Assignments', function() {
    var q,
        scope,
        assignments,
        sampleList;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(module('ordercloud-assignment-helpers'));
    beforeEach(inject(function($q, $rootScope, $state, Assignments) {
        q = $q;
        sampleList = [{ID: 1, selected: true}, {ID: 2, selected: false}, {ID: 3}];
        scope = $rootScope.$new();
        spyOn($state, 'reload').and.returnValue(true);
        assignments = Assignments;
    }));
    it('getAssigned should return a list of IDs', function() {
        var result = assignments.GetAssigned(sampleList, 'ID');
        expect(result).toEqual([1, 2, 3]);
    });
    it('getSelected should return a list of IDs that also have selected set to true', function() {
        var result = assignments.GetSelected(sampleList, 'ID');
        expect(result).toEqual([1]);
    });
    it('getUnselected should return a list of IDs where selected is false or undefined', function() {
        var result = assignments.GetUnselected(sampleList, 'ID');
        expect(result).toEqual([2, 3]);
    });
    it('getToAssign should return a list of IDs that are different between the two lists', function() {
        var result = assignments.GetToAssign(sampleList, [], 'ID');
        expect(result).toEqual([1]);
    });
    it('getToDelete should return a list of IDs that are the same between the two lists', function() {
        var result = assignments.GetToDelete(sampleList, [{ID: 2}], 'ID');
        expect(result).toEqual([2]);
    });
    describe('saveAssignments', function() {
        var state,
            saveFunc,
            deleteFunc,
            saveCount, deleteCount;
        beforeEach(inject(function($state) {
            state = $state;
            saveCount = deleteCount = 0;
            saveFunc = function() {
                saveCount++;
            };
            deleteFunc = function() {
                deleteCount++;
            };
            assignments.SaveAssignments(
                [{ID: 1, selected: true}, {ID: 2, selected: true}, {ID: 3, selected: false}, {ID: 4, selected: false}],
                [{ID: 3}, {ID: 4}],
                saveFunc, deleteFunc, 'ID');
            scope.$digest();
        }));
        it('should call the saveFunc twice', function() {
            expect(saveCount).toBe(2);
        });
        it('should call the deleteFunc twice', function() {
            expect(deleteCount).toBe(2);
        });
        it('should call the state reload function on the current state', function() {
            expect(state.reload).toHaveBeenCalledWith(state.current);
        });
    });
});