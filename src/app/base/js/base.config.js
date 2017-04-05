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
            CurrentUser: function($q, $state, OrderCloud, sdkOrderCloud, buyerid) {
                return sdkOrderCloud.Me.Get()
                    .then(function(data) {
                        OrderCloud.BuyerID.Set(buyerid); //TODO: remove this line after refactor is complete
                        return data;
                    })
                    .catch(function(ex) {
                        $state.go('login');
                    })
            },
            ExistingOrder: function($q, sdkOrderCloud, CurrentUser) {
                var options = {
                    page: 1,
                    pageSize: 1,
                    sortBy: '!DateCreated',
                    filters: {Status: 'Unsubmitted'}
                };
                return sdkOrderCloud.Me.ListOrders(options)
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
            AnonymousUser: function($q, sdkOrderCloud, CurrentUser) {
                CurrentUser.Anonymous = angular.isDefined(JSON.parse(atob(sdkOrderCloud.GetToken().split('.')[1])).orderid);
            }
        }
    });
}