angular.module('orderCloud')
    .config(ProductConfig)
    .controller('ProductDetailCtrl', ProductDetailController)
;

function ProductConfig($stateProvider) {
    $stateProvider
        .state('productDetail', {
            parent: 'base',
            url: '/product/:productid',
            templateUrl: 'productDetail/templates/productDetail.tpl.html',
            controller: 'ProductDetailCtrl',
            controllerAs: 'productDetail',
            resolve: {
                Product: function ($stateParams, OrderCloud) {
                    return OrderCloud.Me.GetProduct($stateParams.productid);
                }
            }
        });
}


function ProductDetailController($exceptionHandler, Product, CurrentOrder, LineItemHelpers, toastr) {
    var vm = this;
    vm.item = Product;
    vm.finalPriceBreak = null;

    vm.addToCart = function() {
        LineItemHelpers.AddItem(CurrentOrder, vm.item)
            .then(function(){
                toastr.success('Product added to cart', 'Success')
            })
            .catch(function(error){
               $exceptionHandler(error);
            });
    };

    vm.findPrice = function(qty){
        angular.forEach(vm.item.StandardPriceSchedule.PriceBreaks, function(priceBreak) {
            if (priceBreak.Quantity <= qty)
                vm.finalPriceBreak = angular.copy(priceBreak);
        });

        return vm.finalPriceBreak.Price * qty;
    };
}

