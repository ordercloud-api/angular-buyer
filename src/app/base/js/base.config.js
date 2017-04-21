angular.module('orderCloud')
    .config(BaseConfig)
;

function BaseConfig($stateProvider) {
    $stateProvider.state('base', {
        url: '',
        abstract: true,
        views: {
            '': {
                templateUrl: 'base/templates/base.html',
                controller: 'BaseCtrl',
                controllerAs: 'base'
            },
            'nav@base': {
                'templateUrl': 'base/templates/navigation.html'
            }
        },
        resolve: {
            CurrentUser: function($state, OrderCloudSDK) {
                return OrderCloudSDK.Me.Get()
                    .then(function(data) {
                        return data;
                    })
                    .catch(function(ex) {
                        $state.go('login');
                    });
            },
            ExistingOrder: function($q, OrderCloudSDK, CurrentUser) {
                var options = {
                    page: 1,
                    pageSize: 1,
                    sortBy: '!DateCreated',
                    filters: {Status: 'Unsubmitted'}
                };
                return OrderCloudSDK.Me.ListOrders(options)
                    .then(function(data) {
                        return data.Items[0];
                    });
            },
            CurrentOrder: function(ExistingOrder, ocNewOrder, CurrentUser) {
                if (!ExistingOrder) {
                    return ocNewOrder.Create({});
                } else {
                    return ExistingOrder;
                }
            },
            AnonymousUser: function($q, OrderCloudSDK, CurrentUser) {
                CurrentUser.Anonymous = angular.isDefined(JSON.parse(atob(OrderCloudSDK.GetToken().split('.')[1])).orderid);
            }
        }
    });
}