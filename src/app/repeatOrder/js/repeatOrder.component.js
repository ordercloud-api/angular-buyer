angular.module('orderCloud')
    .component('ordercloudRepeatOrder', OrderCloudRepeatOrderComponent())
;

function OrderCloudRepeatOrderComponent() {
    var component = {
        templateUrl: 'repeatOrder/templates/repeatOrder.component.html',
        controller: 'RepeatOrderCtrl',
        bindings: {
            currentOrderId: '<',
            originalOrderId: '<'
        }
    };

    return component;
}