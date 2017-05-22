angular.module('orderCloud')
    .factory('ocReorder', ocReorderService)
;

function ocReorderService($q, toastr, $exceptionHandler, OrderCloudSDK, ocLineItems, $uibModal) {
    return {
        Open: _open,
        AddLineItemsToCart: _addLineItemsToCart,
        GetValidLineItems: _getValidLineItems
    };
    
    function _open(currentOrderID, lineItems){
        return $uibModal.open({
            templateUrl: 'common/directives/oc-reorder/templates/oc-reorder.modal.html',
            controller:  'ReorderModalCtrl',
            controllerAs: 'reorderModal',
            size: 'md',
            resolve: {
                OrderID: function() {
                    if(currentOrderID){
                        return currentOrderID;
                    } else {
                        var options = {
                            page: 1,
                            pageSize: 1,
                            sortBy: '!DateCreated',
                            filters: {Status: 'Unsubmitted'}
                        };
                        return OrderCloudSDK.Me.ListOrders(options)
                            .then(function(orders) {
                                return orders.Items[0].ID;
                            });
                    }
                },
                LineItems: function() {
                    return lineItems;
                }
            }
        }).then;
    }

    function _getValidLineItems(previousOrderID) {
        return ocLineItems.ListAll(previousOrderID)
            .then(function(li){
                var productIds = _.pluck(li, 'ProductID');
                return getValidProducts(productIds)
                    .then(function(validProducts){
                        var validLI = [];
                        var invalidLI = [];
                        var validProductIDs = _.pluck(validProducts, 'ID');
                        
                        _.each(li, function(lineItem){
                            if(validProductIDs.indexOf(lineItem.ProductID) > -1){
                                var product = _.findWhere(validProducts, {ID: lineItem.ProductID});
                                lineItem.Product = product; //product from me get has price schedule info
                                validLI.push(lineItem);
                            } else {
                                invalidLI.push(lineItem);
                            }
                        });
                        return {valid: validLI, invalid: invalidLI};
                    });
            });

            function getValidProducts(ids, products){
                //returns products from previous order that are assigned to current user
                var validProducts = products || []; 
                var chunk = ids.splice(0, 25); //keep small so query params dont get overloaded;
                return OrderCloudSDK.Me.ListProducts({filters: {ID: chunk.join('|')}})
                    .then(function(productList){
                        validProducts = validProducts.concat(productList.Items);
                        if(ids.length) {
                            return getValidProducts(ids, validProducts);
                        } else {
                            return validProducts;
                        }
                    });
            }
    }


    function _addLineItemsToCart(validLI, orderID) {
        var queue = [];
        _.each(validLI, function(li){
            var lineItemToAdd = {
                ProductID: li.ProductID,
                Quantity: getQuantity(li),
                Specs: li.Specs
            };
            queue.push(OrderCloudSDK.LineItems.Create('outgoing', orderID, lineItemToAdd));
        });
        return $q.all(queue)
            .then(function(results){
                return toastr.success('Product(s) Add to Cart', 'Success');
            })
            .catch(function(error){
                return $exceptionHandler(error);
            });
        function getQuantity(li){
            var minQty = li.Product.PriceSchedule.MinQuantity;
            var maxQty = li.Product.PriceSchedule.MaxQuantity;
            var quantity = 1;
            
            if(li.Quantity > minQty) {
                if(maxQty) {
                    if(li.Quantity < maxQty){
                        quantity = li.Quantity;
                    } else {
                        quantity = maxQty;
                    }
                } else {
                    quantity = li.Quantity;
                }
            } else {
                quantity = minQty;
            }

            return quantity;
        }
    }
}