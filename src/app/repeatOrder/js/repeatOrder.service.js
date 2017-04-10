angular.module('orderCloud')
    .factory('ocRepeatOrder', OrderCloudRepeatOrderService)
;

function OrderCloudRepeatOrderService($q, $rootScope, toastr, $exceptionHandler, OrderCloudSDK, ocLineItems, catalogid) {
    return {
        GetValidLineItems: getValidLineItems,
        AddLineItemsToCart: addLineItemsToCart
    };

    function getValidLineItems(originalOrderID) {
        var dfd = $q.defer();
        ListAllMeProducts()
            .then(function(productList) {
                var productIds = _.pluck(productList, 'ID');
                ocLineItems.ListAll(originalOrderID)
                    .then(function(lineItemList) {
                        lineItemList.ProductIds = productIds;
                        var valid = [];
                        var invalid = [];
                        angular.forEach(lineItemList, function(li) {
                            productIds.indexOf(li.ProductID) > -1 ? valid.push(li) : invalid.push(li);
                        });
                        dfd.resolve({valid: valid, invalid: invalid});
                    });
            });
        return dfd.promise;

        function ListAllMeProducts() {
            var dfd = $q.defer();
            var queue = [];
            var options = {
                catalogID: catalogid,
                page: 1,
                pageSize: 100,
                depth: 'all'
            };  
            OrderCloudSDK.Me.ListProducts(options)
                .then(function(data) {
                    var productList = data;
                    if (data.Meta.TotalPages > data.Meta.Page) {
                        var page = data.Meta.Page;
                        while (page < data.Meta.TotalPages) {
                            page++;
                            options.page = page;
                            queue.push(OrderCloudSDK.Me.ListProducts(options));
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
                            dfd.reject(err);
                        });
                });
            return dfd.promise;
        }
    }

    function addLineItemsToCart(validLI, orderID) {
        var queue = [];
        var dfd = $q.defer();
        angular.forEach(validLI, function(li){
            var lineItemToAdd = {
                ProductID: li.ProductID,
                Quantity: li.Quantity,
                Specs: li.Specs
            };
            queue.push(OrderCloudSDK.LineItems.Create('outgoing', orderID, lineItemToAdd));
        });
        $q.all(queue)
            .then(function(){
                dfd.resolve();
                toastr.success('Products successfully add to your cart.');
            })
            .catch(function(error){
                $exceptionHandler(error);
                dfd.reject(error);
            });
        return dfd.promise;
    }
}