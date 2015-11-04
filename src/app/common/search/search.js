angular.module('ordercloud-search', []);
angular.module('ordercloud-search')

    .directive( 'ordercloudSearch', ordercloudSearch)
    .controller( 'ordercloudSearchCtrl', ordercloudSearchCtrl)
    .factory( 'TrackSearch', trackSearchService )
;

function ordercloudSearch () {
    return {
        scope: {
            servicename: "@",
            controlleras: "="
        },
        restrict: 'E',
        templateUrl: 'common/search/templates/search.tpl.html',
        controller: 'ordercloudSearchCtrl',
        controllerAs: 'ocSearch',
        replace: true
    }
}

function ordercloudSearchCtrl($timeout, $scope, $injector, TrackSearch) {
    $scope.searchTerm = null;
    $scope.placeholder = "Search " + $scope.servicename + '...';
    var Service = $injector.get($scope.servicename);
    var searching;
    $scope.$watch('searchTerm', function(n,o) {
        if (n == o) {
            if (searching) $timeout.cancel(searching);
        } else {
            if (searching) $timeout.cancel(searching);
            searching = $timeout(function() {
                n == '' ? n = null : angular.noop();
                TrackSearch.SetTerm(n);
                Service.List(n)
                    .then(function (data){
                        $scope.controlleras.list = data;
                    });
            }, 300);
        }
    });
}

function trackSearchService() {
    var service = {
        SetTerm: _setTerm,
        GetTerm: _getTerm
    };

    var term = null;

    function _setTerm(value) {
        term = value;
    }

    function _getTerm() {
        return term;
    }

    return service;
}

