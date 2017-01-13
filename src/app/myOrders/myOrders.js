angular.module('orderCloud')
    .config(MyOrdersConfig)
    .controller('MyOrdersCtrl', MyOrdersController)
    .controller('MyOrderDetailCtrl', MyOrderDetailController)

function MyOrdersConfig($stateProvider) {
    $stateProvider
        .state('myOrders', {
            parent: 'account',
            templateUrl: 'myOrders/templates/myOrders.tpl.html',
            controller: 'MyOrdersCtrl',
            controllerAs: 'myOrders',
            data: {
                pageTitle: "Order History"
            },
            url: '/myorders?from&to&search&page&pageSize&searchOn&sortBy&filters?favorites',
            resolve: {
                Parameters: function($stateParams, ocParameters) {
                    return ocParameters.Get($stateParams);
                },
                OrderList: function(OrderCloud, Parameters, CurrentUser) {
                    if (Parameters.favorites && CurrentUser.xp.FavoriteOrders) {
                        Parameters.filters ? angular.extend(Parameters.filters, Parameters.filters, {ID:CurrentUser.xp.FavoriteOrders.join('|')}) : Parameters.filters = {ID:CurrentUser.xp.FavoriteOrders.join('|')};
                    } else if (Parameters.filters) {
                        delete Parameters.filters.ID;
                    }
                    var showSubmittedOnly = angular.extend({}, Parameters.filters, {Status:'!Unsubmitted'}); 
                    return OrderCloud.Me.ListOutgoingOrders(Parameters.search, Parameters.page, Parameters.pageSize || 12, Parameters.searchOn, Parameters.sortBy, showSubmittedOnly, Parameters.from, Parameters.to);
                }
            }
        })
        .state('myOrders.detail', {
            url: '/:orderid',
            templateUrl: 'myOrders/templates/myOrders.detail.tpl.html',
            controller: 'MyOrderDetailCtrl',
            controllerAs: 'myOrderDetail',
            resolve: {
                SelectedOrder: function($stateParams, OrderCloud) {
                    return OrderCloud.Me.GetOrder($stateParams.orderid);
                },
                SelectedPayments: function($stateParams, $q, OrderCloud) {
                    var deferred = $q.defer();
                    OrderCloud.Payments.List($stateParams.orderid)
                        .then(function(data) {
                            var queue = [];
                            angular.forEach(data.Items, function(payment, index) {
                                if (payment.Type === 'CreditCard' && payment.CreditCardID) {
                                    queue.push((function() {
                                        var d = $q.defer();
                                        OrderCloud.Me.GetCreditCard(payment.CreditCardID)
                                            .then(function(cc) {
                                                data.Items[index].Details = cc;
                                                d.resolve();
                                            });
                                        return d.promise;
                                    })());
                                } else if (payment.Type === 'SpendingAccount' && payment.SpendingAccountID) {
                                    queue.push((function() {
                                        var d = $q.defer();
                                        OrderCloud.Me.GetSpendingAccount(payment.SpendingAccountID)
                                            .then(function(cc) {
                                                data.Items[index].Details = cc;
                                                d.resolve();
                                            });
                                        return d.promise;
                                    })());
                                }
                            });
                            $q.all(queue)
                                .then(function() {
                                    deferred.resolve(data);
                                })
                        });

                    return deferred.promise;
                },
                LineItemList: function($q, $stateParams, OrderCloud, ocLineItems) {
                    var dfd = $q.defer();
                    OrderCloud.LineItems.List($stateParams.orderid, null, 1, 100)
                        .then(function(data) {
                            ocLineItems.GetProductInfo(data.Items)
                                .then(function() {
                                    dfd.resolve(data);
                                });
                        });
                    return dfd.promise;
                },
                PromotionList: function($stateParams, OrderCloud){
                    return OrderCloud.Orders.ListPromotions($stateParams.orderid);
                }
            }
        });
}

function MyOrdersController($state, $ocMedia, OrderCloud, ocParameters, OrderList, Parameters) {
    var vm = this;
    vm.list = OrderList;
    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') == 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;

    //Check if filters are applied
    vm.filtersApplied = vm.parameters.filters || vm.parameters.from || vm.parameters.to || ($ocMedia('max-width:767px') && vm.sortSelection); //Sort by is a filter on mobile devices
    vm.showFilters = vm.filtersApplied;

    //Check if search was used
    vm.searchResults = Parameters.search && Parameters.search.length > 0;

    //Reload the state with new parameters
    vm.filter = function(resetPage) {
        if(vm.parameters.filters && vm.parameters.filters.Status === null) delete vm.parameters.filters.Status;
        $state.go('.', ocParameters.Create(vm.parameters, resetPage));
    };

    vm.toggleFavorites = function() {
        if (vm.parameters.filters && vm.parameters.filters.ID) delete vm.parameters.filters.ID;
        if (vm.parameters.favorites) {
            vm.parameters.favorites = '';
        } else {
            vm.parameters.favorites = true;
            vm.parameters.page = '';
        }
        vm.filter(true);
    };

    //Reload the state with new search parameter & reset the page
    vm.search = function() {
        vm.filter(true);
    };

    //Clear the search parameter, reload the state & reset the page
    vm.clearSearch = function() {
        vm.parameters.search = null;
        vm.filter(true);
    };

    //Clear relevant filters, reload the state & reset the page
    vm.clearFilters = function() {
        vm.parameters.filters = null;
        vm.parameters.favorites = null;
        vm.parameters.from = null;
        vm.parameters.to = null;
        $ocMedia('max-width:767px') ? vm.parameters.sortBy = null : angular.noop(); //Clear out sort by on mobile devices
        vm.filter(true);
    };

    //Conditionally set, reverse, remove the sortBy parameter & reload the state
    vm.updateSort = function(value) {
        value ? angular.noop() : value = vm.sortSelection;
        switch (vm.parameters.sortBy) {
            case value:
                vm.parameters.sortBy = '!' + value;
                break;
            case '!' + value:
                vm.parameters.sortBy = null;
                break;
            default:
                vm.parameters.sortBy = value;
        }
        vm.filter(false);
    };

    //Used on mobile devices
    vm.reverseSort = function() {
        Parameters.sortBy.indexOf('!') == 0 ? vm.parameters.sortBy = Parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    };

    //Reload the state with the incremented page parameter
    vm.pageChanged = function(page) {
        $state.go('.', {page: page});
    };

    //Load the next page of results with all of the same parameters
    vm.loadMore = function() {
        return OrderCloud.Me.ListIncomingOrders(Parameters.from, Parameters.to, Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };
}

function MyOrderDetailController($state, $exceptionHandler, toastr, OrderCloud, ocConfirm, SelectedOrder, SelectedPayments, LineItemList, PromotionList) {
    var vm = this;
    vm.order = SelectedOrder;
    vm.list = LineItemList;
    vm.paymentList = SelectedPayments.Items;
    vm.canCancel = SelectedOrder.Status === 'Unsubmitted' || SelectedOrder.Status === 'AwaitingApproval';
    vm.promotionList = PromotionList.Meta ? PromotionList.Items : PromotionList;
    
    vm.cancelOrder = function(orderid) {
        ocConfirm.Confirm('Are you sure you want to cancel this order?')
            .then(function() {
                OrderCloud.Orders.Cancel(orderid)
                    .then(function() {
                        $state.go('myOrders', {}, {reload: true});
                        toastr.success('Order Cancelled', 'Success');
                    })
                    .catch(function(ex) {
                        $exceptionHandler(ex);
                    });
            });
    };
}