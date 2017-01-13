angular.module('orderCloud')
    .config(BaseConfig)
    .controller('BaseCtrl', BaseController)
<<<<<<< HEAD
    .filter('occomponents', occomponents)
;

function BaseConfig($stateProvider, $injector) {
    var baseViews = {
        '': {
            templateUrl: 'base/templates/base.tpl.html',
            controller: 'BaseCtrl',
            controllerAs: 'base'
        }
    };

    if ($injector.has('base')) {
        var baseConfig = $injector.get('base');

        //conditional base left
        baseConfig.left ? baseViews['left@base'] = {
            'templateUrl': 'base/templates/base.left.tpl.html'
        } : angular.noop();

        //conditional base right
        baseConfig.right ? baseViews['right@base'] = {
            'templateUrl': 'base/templates/base.right.tpl.html'
        } : angular.noop();

        //conditional base top
        baseConfig.top ? baseViews['top@base'] = {
            'templateUrl': 'base/templates/base.top.tpl.html'
        } : angular.noop();

        //conditional base bottom
        baseConfig.bottom ? baseViews['bottom@base'] = {
            'templateUrl': 'base/templates/base.bottom.tpl.html'
        } : angular.noop();
    }

    var baseState = {
        url: '',
        abstract: true,
        views: baseViews,
        resolve: {
            CurrentUser: function($q, $state, OrderCloud, buyerid, anonymous) {
                var dfd = $q.defer();
                OrderCloud.Me.Get()
                    .then(function(data) {
                        dfd.resolve(data);
                    })
                    .catch(function(){
                        if (anonymous) {
                            if (!OrderCloud.Auth.ReadToken()) {
                                OrderCloud.Auth.GetToken('')
                                    .then(function(data) {
                                        OrderCloud.Auth.SetToken(data['access_token']);
                                    })
                                    .finally(function() {
                                        OrderCloud.BuyerID.Set(buyerid);
                                        dfd.resolve({});
                                    });
                            }
                        } else {
                            OrderCloud.Auth.RemoveToken();
                            OrderCloud.Auth.RemoveImpersonationToken();
                            OrderCloud.BuyerID.Set(null);
                            $state.go('login');
                            dfd.resolve();
                        }
                    });
                return dfd.promise;
            },
            AnonymousUser: function($q, OrderCloud, CurrentUser) {
                CurrentUser.Anonymous = angular.isDefined(JSON.parse(atob(OrderCloud.Auth.ReadToken().split('.')[1])).orderid);
            },
            ComponentList: function($state, $q, Underscore, CurrentUser) {
                var deferred = $q.defer();
                var nonSpecific = ['Buyers', 'Products', 'Specs', 'Price Schedules', 'Admin Users', 'Product Facets'];
                var components = {
                    nonSpecific: [],
                    buyerSpecific: []
                };
                angular.forEach($state.get(), function(state) {
                    if (!state.data || !state.data.componentName) return;
                    if (nonSpecific.indexOf(state.data.componentName) > -1) {
                        if (Underscore.findWhere(components.nonSpecific, {Display: state.data.componentName}) == undefined) {
                            components.nonSpecific.push({
                                Display: state.data.componentName,
                                StateRef: state.name
                            });
                        }
                    } else {
                        if (Underscore.findWhere(components.buyerSpecific, {Display: state.data.componentName}) == undefined) {
                            components.buyerSpecific.push({
                                Display: state.data.componentName,
                                StateRef: state.name
                            });
                        }
                    }
                });
                deferred.resolve(components);
                return deferred.promise;
            }
        }
    };

    $stateProvider.state('base', baseState);
}

function BaseController($rootScope, $ocMedia, Underscore, snapRemote, defaultErrorMessageResolver, CurrentUser, ComponentList, base) {
    var vm = this;
    vm.left = base.left;
    vm.right = base.right;
    vm.currentUser = CurrentUser;
    vm.catalogItems = ComponentList.nonSpecific;
    vm.organizationItems = ComponentList.buyerSpecific;
    vm.registrationAvailable = Underscore.filter(vm.organizationItems, function(item) { return item.StateRef == 'registration' }).length;

    defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
        errorMessages['customPassword'] = 'Password must be at least eight characters long and include at least one letter and one number';
        //regex for customPassword = ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$
        errorMessages['positiveInteger'] = 'Please enter a positive integer';
        //regex positiveInteger = ^[0-9]*[1-9][0-9]*$
        errorMessages['ID_Name'] = 'Only Alphanumeric characters, hyphens and underscores are allowed';
        //regex ID_Name = ([A-Za-z0-9\-\_]+)
        errorMessages['confirmpassword'] = 'Your passwords do not match';
        errorMessages['noSpecialChars'] = 'Only Alphanumeric characters are allowed';
    });

    vm.snapOptions = {
        disable: (!base.left && base.right) ? 'left' : ((base.left && !base.right) ? 'right' : 'none')
    };

    function _isMobile() {
        return $ocMedia('max-width:991px');
    }

    function _initDrawers(isMobile) {
        snapRemote.close('MAIN');
        if (isMobile && (base.left || base.right)) {
            snapRemote.enable('MAIN');
        } else {
            snapRemote.disable('MAIN');
        }
    }

    _initDrawers(_isMobile());

    $rootScope.$watch(_isMobile, function(n, o) {
        if (n === o) return;
        _initDrawers(n);
    });
}

function occomponents() {
    return function(components) {
        var filtered = ['registration'];
        var result = [];

        angular.forEach(components, function(component) {
            if (filtered.indexOf(component.StateRef) == -1) result.push(component);
        });

        return result;
    }
}
=======
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
            ExistingOrder: function($q, OrderCloud, CurrentUser) {
                return OrderCloud.Me.ListOutgoingOrders(null, 1, 1, null, "!DateCreated", {Status:"Unsubmitted"})
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
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
