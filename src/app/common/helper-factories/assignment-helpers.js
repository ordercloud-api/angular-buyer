angular.module('ordercloud-assignment-helpers', [])

    .factory('Assignments', AssignmentHelpers)

;

function AssignmentHelpers($q, Underscore, $state) {
    return {
        getAssigned: getAssigned,
        getSelected: getSelected,
        getUnselected: getUnselected,
        getToAssign: getToAssign,
        getToDelete: getToDelete,
        saveAssignments: saveAssignments
    };

    function getAssigned(AssignmentsArray, ID_Name) {
        //TODO: Save this result in temp variable so I don't do this operation twice every time.
        return Underscore.pluck(AssignmentsArray, ID_Name);
    }

    function getSelected(ListArray) {
        return Underscore.pluck(Underscore.where(ListArray, {selected: true}), 'ID');
    }

    function getUnselected(ListArray) {
        return Underscore.pluck(Underscore.filter(ListArray, function(item) {
            return !item.selected;
        }), 'ID');
    }

    function getToAssign(ListArray, AssignmentsArray, ID_Name) {
        return Underscore.difference(getSelected(ListArray), getAssigned(AssignmentsArray, ID_Name));
    }

    function getToDelete(ListArray, AssignmentsArray, ID_Name) {
        return Underscore.intersection(getUnselected(ListArray), getAssigned(AssignmentsArray, ID_Name));
    }

    function saveAssignments(ListArray, AssignmentsArray, SaveFunc, DeleteFunc, ID_Name) {
        var id_name = ID_Name ? ID_Name : 'UserGroupID';
        var toAssign = getToAssign(ListArray, AssignmentsArray, id_name);
        var toDelete = getToDelete(ListArray, AssignmentsArray, id_name);
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