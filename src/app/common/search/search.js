angular.module('ordercloud-search', []);

angular.module('ordercloud-search')
    .directive('ordercloudSearch', OrdercloudSearch)
    .controller('ordercloudSearchCtrl', OrdercloudSearchController)
    .factory('TrackSearch', TrackSearchService )
;

function OrdercloudSearch () {
    return {
        scope: {
            placeholder: '@',
            servicename: '@',
            controlleras: '=',
            model:'@'
        },
        restrict: 'E',
        templateUrl: 'common/search/templates/search.tpl.html',
        controller: 'ordercloudSearchCtrl',
        controllerAs: 'ocSearch',
        replace: true
    }
}

function OrdercloudSearchController($timeout, $scope, OrderCloud, TrackSearch) {
    $scope.searchTerm = null;
    if ($scope.servicename) {
        var var_name = $scope.servicename.replace(/([a-z])([A-Z])/g, '$1 $2');
        $scope.placeholder = "Search " + var_name + '...';
        var Service = OrderCloud[$scope.servicename];
    }
    var searching;
    $scope.$watch('searchTerm', function(n,o) {
        if (n == o) {
            if (searching) $timeout.cancel(searching);
        } else {
            if (searching) $timeout.cancel(searching);
            searching = $timeout(function() {
                n == '' ? n = null : angular.noop();
                TrackSearch.SetTerm(n);
                if($scope.servicename === 'Orders') {
                    if (!$scope.controlleras.searchfunction) {
                        Service.ListIncoming(null, null, n)
                            .then(function (data){
                                $scope.model ? $scope.controlleras[$scope.model] = data : $scope.controlleras.list = data;
                            });
                    }
                    else {
                        $scope.controlleras.searchfunction($scope.searchTerm)
                            .then(function (data){
                                $scope.model ? $scope.controlleras[$scope.model] = data : $scope.controlleras.list = data;
                            });
                    }
                }
                else if ($scope.servicename === 'SpendingAccounts') {
                    if (!$scope.controlleras.searchfunction) {
                        Service.List(n, null, null, null, null, {'RedemptionCode': '!*'})
                            .then(function (data){
                                $scope.model ? $scope.controlleras[$scope.model] = data : $scope.controlleras.list = data;
                            });
                    }
                    else {
                        $scope.controlleras.searchfunction($scope.searchTerm)
                            .then(function (data){
                                $scope.model ? $scope.controlleras[$scope.model] = data : $scope.controlleras.list = data;
                            });
                    }
                }
                else if ($scope.servicename === 'Users') {
                    if (!$scope.controlleras.searchfunction) {
                        Service.List(null, n)
                            .then(function (data){
                                $scope.model ? $scope.controlleras[$scope.model] = data : $scope.controlleras.list = data;
                            });
                    }
                    else {
                        $scope.controlleras.searchfunction($scope.searchTerm)
                            .then(function (data){
                                $scope.model ? $scope.controlleras[$scope.model] = data : $scope.controlleras.list = data;
                            });
                    }
                }
                else if ($scope.servicename === 'Shipments') {
                    if (!$scope.controlleras.searchfunction) {
                        Service.List(null, n, null, null)
                            .then(function (data) {
                                $scope.model ? $scope.controlleras[$scope.model] = data : $scope.controlleras.list = data;
                            });
                    }
                    else {
                        $scope.controlleras.searchfunction($scope.searchTerm)
                            .then(function (data){
                                $scope.model ? $scope.controlleras[$scope.model] = data : $scope.controlleras.list = data;
                            });
                    }
                }
                else {
                    if (!$scope.controlleras.searchfunction) {
                        Service.List(n)
                            .then(function (data){
                                $scope.model ? $scope.controlleras[$scope.model] = data : $scope.controlleras.list = data;
                            });
                    }
                    else {
                        $scope.controlleras.searchfunction($scope.searchTerm)
                            .then(function (data){
                                $scope.model ? $scope.controlleras[$scope.model] = data : $scope.controlleras.list = data;
                            });
                    }
                }

            }, 300);
        }
    });
}

function TrackSearchService() {
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

