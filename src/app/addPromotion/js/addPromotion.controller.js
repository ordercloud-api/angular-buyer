angular.module('orderCloud')
    .controller('AddPromotionComponentCtrl', AddPromotionComponentController)
;

function AddPromotionComponentController($exceptionHandler, $rootScope, sdkOrderCloud, toastr) {
    this.submit = function(orderID, promoCode) {
        sdkOrderCloud.Orders.AddPromotion('outgoing', orderID, promoCode)
            .then(function(promo) {
                $rootScope.$broadcast('OC:UpdatePromotions', orderID);
                $rootScope.$broadcast('OC:UpdateOrder', orderID);
                toastr.success('Promo code '+ promo.Code + ' successfully added.');
            })
            .catch(function(err) {
                $exceptionHandler(err);
            });
    };
}