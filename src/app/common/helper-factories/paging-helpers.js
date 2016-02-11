angular.module('ordercloud-paging-helpers', ['ordercloud-assignment-helpers'])

    .factory('Paging', PagingHelpers)

;

function PagingHelpers($q, OrderCloud, Assignments) {
    return {
        setSelected: setSelected,
        paging: pagingFunction
    };

    function setSelected(ListArray, AssignmentsArray, ID_Name) {
        if (!ListArray || !AssignmentsArray || !ID_Name) return;
        var assigned = Assignments.getAssigned(AssignmentsArray, ID_Name);
        angular.forEach(ListArray, function(item) {
            if (assigned.indexOf(item.ID) > -1) {
                item.selected = true;
            }
        });
    }

    function pagingFunction(ListObject, ServiceName, AssignmentObjects, AssignmentFunc) {
        var Service = OrderCloud[ServiceName];
        if (Service && ListObject.Meta.Page < ListObject.Meta.TotalPages) {
            var queue = [];
            var dfd = $q.defer();
            if (ServiceName !== 'Orders') {
                queue.push(Service.List(null, ListObject.Meta.Page + 1, ListObject.Meta.PageSize));
            }
            else {
                queue.push(Service.List('incoming', null, null, null, ListObject.Meta.Page + 1, ListObject.Meta.PageSize));
            }
            if (AssignmentFunc !== undefined && (AssignmentObjects.Meta.Page < AssignmentObjects.Meta.TotalPages)) {
                queue.push(AssignmentFunc());
            }
            $q.all(queue).then(function(results) {
                dfd.resolve();
                ListObject.Meta = results[0].Meta;
                ListObject.Items = [].concat(ListObject.Items, results[0].Items);
                if (results[1]) {
                    AssignmentObjects.Meta = results[1].Meta;
                    AssignmentObjects.Items = [].concat(AssignmentObjects.Items, results[1].Items);
                }
            });
            return dfd.promise;
        }
        else return null;
    }
}
