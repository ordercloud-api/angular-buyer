angular.module('ordercloud-infinite-scroll', ['ordercloud-search']);
angular.module('ordercloud-infinite-scroll')

    .directive( 'ordercloudInfiniteScroll', InfiniteScrollDirective )
    .controller( 'InfiniteScrollCtrl', InfiniteScrollController )
    .factory( 'PagingFunctions', PagingFunctionsFactory )
;

function InfiniteScrollDirective(PagingFunctions) {
    return {
        restrict: 'A',
        scope: {
            pagingfunction: '&',
            servicename: '@',
            listobject: '=',
            threshold: '@',
            usergrouplist: '=',
            selectedid: '@'
        },
        controller: 'InfiniteScrollCtrl',
        controllerAs: 'InfiniteScroll',
        link: function(scope, element, attrs) {
            var threshold = scope.threshold || 0;
            var ele = element[0];
            element.bind('scroll', function () {
                if (ele.scrollTop + ele.offsetHeight + threshold >= ele.scrollHeight) {
                    if (scope.servicename && scope.listobject && scope.usergrouplist && scope.selectedid) {
                        PagingFunctions.assignmentsPaging(scope.servicename, scope.listobject, scope.usergrouplist, scope.selectedid);
                    }
                    /* Use preset factory */
                    else if (scope.servicename && scope.listobject) {
                        PagingFunctions.componentPaging(scope.servicename, scope.listobject);
                    }
                    /* Check if paging function is defined */
                    else if (scope.pagingfunction != undefined && typeof(scope.pagingfunction) == 'function') {
                        scope.pagingfunction();
                    }
                    /* Else display a console error */
                    else {
                        console.log('Error: Infinite scroll directive not fully defined.');
                    }
                }
            });
        }
    }
}

function InfiniteScrollController($scope, PagingFunctions) {
    PagingFunctions.reset();
    if ($scope.usergrouplist) {
        PagingFunctions.setSelected($scope.listobject, $scope.usergrouplist);
    }
}

function PagingFunctionsFactory($injector, UserGroups, TrackSearch) {
    var page = 1,
        pageSize = 20,
        nonBuyerSpecific = [
            'Buyers',
            'Products',
            'PriceSchedules',
            'Specs'
        ],
        service = {
            reset: initPaging,
            setSelected: setSelected,
            componentPaging: componentPaging,
            assignmentsPaging: assignmentsPaging
        };
    return service;

    function initPaging() {
        TrackSearch.SetTerm(null);
    }

    function componentPaging(component, componentObject) {
        var componentService = $injector.get(component);
        //page += 1;
        if (componentObject.Meta.Page + 1 <= componentObject.Meta.TotalPages && componentService) {
            var args = [];
            if (component === 'Orders') {
                args = ['incoming', TrackSearch.GetTerm(), null, null, componentObject.Meta.Page + 1, componentObject.Meta.PageSize];
            }
            else {
                args = [ TrackSearch.GetTerm(), componentObject.Meta.Page + 1, componentObject.Meta.PageSize];
            }
            componentService.List.apply(this, args)
                .then(function(data) {
                    componentObject.Meta = data.Meta;
                    componentObject.Items = [].concat(componentObject.Items, data.Items);
                });
        }
    }

    function assignmentsPaging(component, componentObject, UserGroupList, selectedID) {
        var componentService = $injector.get(component);
        page += 1;
        if (page <= UserGroupList.Meta.TotalPages && componentService) {
            UserGroups.List(null, page, UserGroupList.Meta.PageSize)
                .then(function(data) {
                    UserGroupList.Meta = data.Meta;
                    UserGroupList.Items = [].concat(UserGroupList.Items, data.Items);
                    if (page <= componentObject.Meta.TotalPages) {
                        var args = [selectedID, null, null, page, UserGroupList.Meta.PageSize];
                        componentService.ListAssignments.apply(this, args)
                            .then(function(data) {
                                componentObject.Meta = data.Meta;
                                componentObject.Items = [].concat(componentObject.Items, data.Items);
                                setSelected(componentObject, UserGroupList);
                            });
                    }
                    else {
                        setSelected(componentObject, UserGroupList);
                    }
                });
        }
    }

    function setSelected(assignedUserGroups, userGroups) {
        angular.forEach(userGroups.Items, function(group) {
            angular.forEach(assignedUserGroups.Items, function(assignedGroup) {
                if (assignedGroup.UserGroupID === group.ID) {
                    group.selected = true;
                }
            });
        });
    }
}