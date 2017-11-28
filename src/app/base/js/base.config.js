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
            }
        },
        resolve: {
            CurrentUser: function(OrderCloudSDK) {
                return OrderCloudSDK.Me.Get();
            },
            ExistingOrder: function(OrderCloudSDK, CurrentUser) {
                var options = {
                    page: 1,
                    pageSize: 1,
                    sortBy: '!DateCreated',
                    filters: {Status: 'Unsubmitted'}
                };
                return OrderCloudSDK.Me.ListOrders(options)
                    .then(function(orders) {
                        return orders.Items[0];
                    });
            },
            CurrentOrder: function(ExistingOrder, ocNewOrder, CurrentUser) {
                if (!ExistingOrder) {
                    return ocNewOrder.Create({});
                } else {
                    return ExistingOrder;
                }
            },
            TotalQuantity: function(OrderCloudSDK, CurrentOrder) {
                return OrderCloudSDK.LineItems.List('outgoing', CurrentOrder.ID)
                    .then(function(lineItems) {
                        var quantities = _.pluck(lineItems.Items, 'Quantity');
                        return quantities.reduce(function(a, b) {return a + b;}, 0);
                    });
            },
            AnonymousUser: function(OrderCloudSDK, CurrentUser) {
                CurrentUser.Anonymous = angular.isDefined(JSON.parse(atob(OrderCloudSDK.GetToken().split('.')[1])).orderid);
            }
        }
    });
}