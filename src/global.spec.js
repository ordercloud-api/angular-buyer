var q,
    scope,
    state,
    injector,
    oc,
    mock = _mockData();
beforeEach(module('orderCloud'));
beforeEach(module('ordercloud-angular-sdk'));
beforeEach(inject(function($q, $rootScope, $state, $injector, OrderCloudSDK) {
    q = $q;
    scope = $rootScope.$new();
    state = $state;
    injector = $injector;
    oc = OrderCloudSDK;
}));

function _mockData() {
    return {
        Params: {
            Search: 'SEARCH',
            Page: 1,
            PageSize: 20
        },
        Buyer: {
            ID: 'BUYER_ID',
            Name: 'BUYER_NAME',
            DefaultCatalogID: 'BUYER_DEFAULT_CATALOG_ID',
            Active: true
        },
        User: {
            ID: 'USER_ID',
            Username: 'USER_USERNAME',
            FirstName: 'USER_FIRSTNAME'
        },
        Product: {
            ID: 'PRODUCT_ID'
        },
        Order: {
            ID: 'ORDER_ID'
        }
    }
}