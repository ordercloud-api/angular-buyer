angular.module('orderCloud')
    .filter('ocShipmentTracking', OrderCloudShipmentTrackingFilter)
    .filter('ocShipperTrackingSupported', OrderCloudShipperTrackingSupportedFilter)
;

function OrderCloudShipmentTrackingFilter() {
    return function(trackingNumber, shipper) {
        if (!trackingNumber || !shipper) return;

        switch(shipper.toLowerCase()) {
            case 'ups':
                return 'https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=' + trackingNumber;
                break;
            case 'usps':
                return 'https://tools.usps.com/go/TrackConfirmAction?tLabels=' + trackingNumber;
                break;
            case 'fedex':
                return 'https://www.fedex.com/apps/fedextrack/?tracknumbers=' + trackingNumber;
                break;
        }
    }
}

function OrderCloudShipperTrackingSupportedFilter() {
    return function(shipper) {
        if (!shipper) return false;

        var supportedShippers = [
            'ups',
            'usps',
            'fedex'
        ];

        return supportedShippers.indexOf(shipper.toLowerCase()) > -1;
    }
}