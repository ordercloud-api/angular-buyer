angular.module('ordercloud-assignment-helpers', [])
    .factory('Assignments', AssignmentHelpers)
;

function AssignmentHelpers($q, $state) {
    return {
        GetAssigned: _getAssigned,
        GetSelected: _getSelected,
        GetUnselected: _getUnselected,
        GetToAssign: _getToAssign,
        GetToDelete: _getToDelete,
        SaveAssignments: _saveAssignments
    };

    function _getAssigned(AssignmentsArray, ID_Name) {
        //TODO: Save this result in temp variable so I don't do this operation twice every time.
        return _.pluck(AssignmentsArray, ID_Name);
    }

    function _getSelected(ListArray) {
        return _.pluck(_.where(ListArray, {selected: true}), 'ID');
    }

    function _getUnselected(ListArray) {
        return _.pluck(_.filter(ListArray, function(item) {
            return !item.selected;
        }), 'ID');
    }

    function _getToAssign(ListArray, AssignmentsArray, ID_Name) {
        return _.difference(_getSelected(ListArray), _getAssigned(AssignmentsArray, ID_Name));
    }

    function _getToDelete(ListArray, AssignmentsArray, ID_Name) {
        return _.intersection(_getUnselected(ListArray), _getAssigned(AssignmentsArray, ID_Name));
    }

    function _saveAssignments(ListArray, AssignmentsArray, SaveFunc, DeleteFunc, ID_Name) {
        var id_name = ID_Name ? ID_Name : 'UserGroupID';
        var toAssign = _getToAssign(ListArray, AssignmentsArray, id_name);
        var toDelete = _getToDelete(ListArray, AssignmentsArray, id_name);
        var queue = [];
        var dfd = $q.defer();
        angular.forEach(toAssign, function(ItemID) {
            queue.push(SaveFunc(ItemID));
        });
        angular.forEach(toDelete, function(ItemID) {
            queue.push(DeleteFunc(ItemID));
        });
        $q.all(queue).then(function() {
            dfd.resolve();
        }).then(function() {
            $state.reload($state.current);
        });
        return dfd.promise;
    }
}