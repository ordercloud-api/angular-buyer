angular.module('orderCloud')
    .component('ocAddPromotion', OrderCloudAddPromotionComponent())
;

function OrderCloudAddPromotionComponent() {
    var component = {
        templateUrl: 'addPromotion/templates/addPromotion.html',
        bindings: {
            order: '<'
        },
        controller: 'AddPromotionComponentCtrl'
    };

    return component;
}