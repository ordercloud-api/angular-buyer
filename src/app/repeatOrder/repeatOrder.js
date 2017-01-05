angular.module('orderCloud')
    .factory('RepeatOrderFactory', RepeatOrderFactory)
    .controller('RepeatOrderCtrl', RepeatOrderController)
    .directive('ordercloudRepeatOrder', OrderCloudRepeatOrderDirective)
;

function RepeatOrderController(toastr, OrderCloud, RepeatOrderFactory) {
    var vm = this;
    vm.reorder = function(orderID, includebilling, includeshipping, clientid, userid, claims) {
        vm.includeBilling = (includebilling === 'true');
        vm.includeShipping = (includeshipping === 'true');
        vm.userType = JSON.parse(atob(OrderCloud.Auth.ReadToken().split('.')[1])).usrtype;
        if (vm.userType === 'admin' && (!orderID || !clientid)) {
            toastr.error('This directive is not configured correctly. orderID and clientID are required attributes', 'Error');
        }
        else if (vm.userType == 'buyer' && (!orderID)) {
            toastr.error('This directive is not configured correctly. orderID is a required attribute', 'Error')
        }
        else {
            RepeatOrderFactory.SetAccessToken(vm.userType, userid, clientid, claims)
                .then(function() {
                    RepeatOrderFactory.CheckLineItemsValid(vm.userType, orderID)
                        .then(function(validLI) {
                            RepeatOrderFactory.GetCurrentOrderLineItems(validLI)
                                .then(function(totalLI) {
                                    RepeatOrderFactory.Reorder(orderID, vm.includeBilling, vm.includeShipping, totalLI, vm.userType)
                                        .then(function(order) {
                                            RepeatOrderFactory.SuccessConfirmation(order, vm.userType, vm.includeBilling, vm.includeShipping);
                                        });
                                });
                        });
                });
        }
    };
}

function RepeatOrderFactory($q, $state, $localForage, toastr, OrderCloud, ocLineItems, CurrentOrder, appname) {
    return {
        SetAccessToken: _setAccessToken,
        CheckLineItemsValid: _checkLineItemsValid,
        GetCurrentOrderLineItems: _getCurrentOrderLineItems,
        Reorder: _reorder,
        SuccessConfirmation: _successConfirmation
    };

    function _setAccessToken(usertype, userid, clientid, claims) {
        var dfd = $q.defer();
        var tokenRequest = {clientID: clientid, Claims: [claims || 'FullAccess']};
        if (usertype === 'admin') {
            OrderCloud.Users.GetAccessToken(userid, tokenRequest)
                .then(function(token) {
                    OrderCloud.Auth.SetImpersonationToken(token.access_token);
                    dfd.resolve();
                })
                .catch(function() {
                    toastr.error('There was an issue retrieving the access token of the user you are ' +
                        'trying to impersonate. Please make sure the userid and clientid are correct');
                    dfd.reject();
                });
        } else {
            dfd.resolve();
        }
        return dfd.promise;
    }

    function _checkLineItemsValid(userType, originalOrderID) {
        var dfd = $q.defer();
        ListAllProducts()
            .then(function(productList) {
                var productIds = [];
                angular.forEach(productList, function(product) {
                    productIds.push(product.ID);
                });
                ocLineItems.ListAll(originalOrderID)
                    .then(function(lineItemList) {
                        var invalidLI = [];
                        var validLI =[];
                        angular.forEach(lineItemList, function(li) {
                            (productIds.indexOf(li.ProductID) > -1) ? validLI.push(li) : invalidLI.push(li.ProductID);
                        });
                        if (validLI.length && invalidLI.length) {
                            toastr.warning("There are " + invalidLI.length + " productDetail(s) in your cart that either " +
                                "no longer exist or you do not have permission to reorder, the order will process " +
                                "only with the products you are able to order. The ID's of the products that have " +
                                "been excluded are: " + invalidLI.toString());
                            dfd.resolve(validLI)
                        }
                        if (validLI.length && !invalidLI.length) {
                            dfd.resolve(validLI)
                        }
                        if (!validLI.length) {
                            toastr.error('The productDetail(s) from the order you are trying to place either no longer exist ' +
                                'or you do not have permission to reorder', 'Error');
                            dfd.reject();
                        }
                    });
            });
        return dfd.promise;

        function ListAllProducts() {
            var dfd = $q.defer();
            var queue = [];
            ((userType === 'buyer') ? OrderCloud.Me.ListProducts(null, 1, 100) : OrderCloud.As().Me.ListProducts(null, 1, 100))
                .then(function(data) {
                    var productList = data;
                    if (data.Meta.TotalPages > data.Meta.Page) {
                        var page = data.Meta.Page;
                        while (page < data.Meta.TotalPages) {
                            page += 1;
                            (userType === 'buyer') ? queue.push(OrderCloud.Me.ListProducts(null, page, 100)) : queue.push(OrderCloud.As().Me.ListProducts(null, 1, 100))
                        }
                    }
                    $q.all(queue)
                        .then(function(results) {
                            angular.forEach(results, function(result) {
                                productList.Items = [].concat(productList.Items, result.Items);
                            });
                            dfd.resolve(productList.Items);
                        })
                        .catch(function(err) {
                            dfd.reject(err)
                        });
                });
            return dfd.promise;
        }
    }

    function _getCurrentOrderLineItems(validLI) {
        var dfd = $q.defer();
        var totalLI;
        //cant use CurrentOrder.GetID() because if there is not a current ID the promise is rejected which halts everything
        $localForage.getItem(appname + '.CurrentOrderID')
            .then(function(order_id) {
                if (order_id) {
                    ocLineItems.ListAll(order_id)
                        .then(function(li) {
                            if (li.length) {
                                toastr.warning('The line items from your current order were added to this reorder.', 'Please be advised')
                            }
                            totalLI = validLI.concat(li);
                            dfd.resolve(totalLI);
                        })
                        .catch(function(err) {
                            dfd.reject(err)
                        });
                } else {
                    totalLI = validLI;
                    dfd.resolve(totalLI);
                }
            });
        return dfd.promise;
    }

    function _reorder(originalOrderID, includeBilling, includeShipping, totalLI, userType) {
        var dfd = $q.defer();
        OrderCloud.Orders.Get(originalOrderID)
            .then(function(data) {
                var billingAddress = data.BillingAddress;
                (userType === 'buyer' ? OrderCloud.Orders.Create({}) : OrderCloud.As().Orders.Create({}))
                    .then(function(order) {
                        var orderID = order.ID;
                        userType === 'buyer' ? CurrentOrder.Set(orderID) : angular.noop();
                        includeBilling ? OrderCloud.Orders.SetBillingAddress(orderID, billingAddress) : angular.noop();
                        var queue = [];
                        angular.forEach(totalLI, function(lineItem) {
                            delete lineItem.OrderID;
                            delete lineItem.ID;
                            delete lineItem.QuantityShipped;
                            delete lineItem.ShippingAddressID;
                            !includeShipping ? delete lineItem.ShippingAddress : angular.noop();
                            queue.push(OrderCloud.LineItems.Create(orderID, lineItem));
                        });
                        $q.all(queue)
                            .then(function(data) {
                                dfd.resolve(order);
                            })
                            .catch(function(err) {
                                dfd.reject(err);
                            });
                    });
            });
        return dfd.promise;
    }

    function _successConfirmation(order, usertype, includeBilling, includeShipping) {
        if (usertype == 'buyer') {
            (includeBilling || includeShipping) ? $state.go('checkout') : $state.go('cart');
        }
        else{
            toastr.success('Your reorder was successfully placed! The new order number is: ' + order.ID);
            $state.go('orderHistory');
        }
    }
}

function OrderCloudRepeatOrderDirective() {
    return {
        restrict: 'E',
        templateUrl: 'repeatOrder/templates/repeatOrderDirective.tpl.html',
        controller: 'RepeatOrderCtrl',
        controllerAs: 'repeatOrder',
        scope: {
            orderid: '=',
            includebilling: '@',
            includeshipping: '@',
            clientid: '@',
            fromuserid: '@',
            claims: '@'
        }
    }
}