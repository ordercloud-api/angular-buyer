angular.module('orderCloud')
    .config(BaseConfig)
    .controller('BaseCtrl', BaseController)
    .factory('NewOrder', NewOrderService)
;

function BaseConfig($stateProvider) {
    $stateProvider.state('base', {
        url: '',
        abstract: true,
        views: {
            '': {
                templateUrl: 'base/templates/base.tpl.html',
                controller: 'BaseCtrl',
                controllerAs: 'base'
            },
            'nav@base': {
                'templateUrl': 'base/templates/navigation.tpl.html'
            }
        },
        resolve: {
            CurrentUser: function($q, $state, OrderCloud, buyerid) {
                return OrderCloud.Me.Get()
                    .then(function(data) {
                        OrderCloud.BuyerID.Set(buyerid);
                        return data;
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
            CurrentOrder: function(ExistingOrder, NewOrder, CurrentUser) {
                if (!ExistingOrder) {
                    return NewOrder.Create({});
                } else {
                    return ExistingOrder;
                }
            },
            AnonymousUser: function($q, OrderCloud, CurrentUser) {
                CurrentUser.Anonymous = angular.isDefined(JSON.parse(atob(OrderCloud.Auth.ReadToken().split('.')[1])).orderid);
            }
        }
    });
}

function BaseController($rootScope, $state, ProductSearch, CurrentUser, CurrentOrder, OrderCloud) {
    var vm = this;
    vm.currentUser = CurrentUser;
    vm.currentOrder = CurrentOrder;

    vm.mobileSearch = function() {
        ProductSearch.Open()
            .then(function(data) {
                if (data.productID) {
                    $state.go('productDetail', {productid: data.productID});
                } else {
                    $state.go('productSearchResults', {searchTerm: data.searchTerm});
                }
            });
    };

    $rootScope.$on('OC:UpdateOrder', function(event, OrderID, message) {
        vm.orderLoading = {
            message: message
        };
        vm.orderLoading.promise = OrderCloud.Orders.Get(OrderID)
            .then(function(data) {
                vm.currentOrder = data;
            });
    });
}

function NewOrderService($q, OrderCloud) {
    var service = {
        Create: _create
    };

    function _create() {
        var deferred = $q.defer();
        var order = {};

        //ShippingAddressID
        OrderCloud.Me.ListAddresses(null, 1, 100, null, null, {Shipping: true})
            .then(function(shippingAddresses) {
                if (shippingAddresses.Items.length) order.ShippingAddressID = shippingAddresses.Items[0].ID;
                setBillingAddress();
            });

        //BillingAddressID
        function setBillingAddress() {
            OrderCloud.Me.ListAddresses(null, 1, 100, null, null, {Billing: true})
                .then(function(billingAddresses) {
                    if (billingAddresses.Items.length) order.BillingAddressID = billingAddresses.Items[0].ID;
                    createOrder();
                });
        }

        function createOrder() {
            OrderCloud.Orders.Create(order)
                .then(function(order) {
                    deferred.resolve(order);
                });
        }

        return deferred.promise;
    }

    return service;
}