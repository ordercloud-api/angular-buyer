var q,
    rootScope,
    scope,
    state,
    injector,
    exceptionHandler,
    toastrService,
    oc,
    ocAppNameService,
    dummyPromise,
    mock = _mockData();
beforeEach(module('orderCloud'));
beforeEach(module('ordercloud-angular-sdk'));
beforeEach(inject(function($q, $rootScope, $state, $injector, $exceptionHandler, toastr, OrderCloudSDK, ocAppName) {
    q = $q;
    scope = $rootScope.$new();
    rootScope = $rootScope;
    state = $state;
    injector = $injector;
    toastrService = toastr;
    oc = OrderCloudSDK;
    exceptionHandler = $exceptionHandler;
    ocAppNameService = ocAppName;
    var defer = $q.defer();
    defer.resolve('DUMMY_RESPONSE');
    dummyPromise = defer.promise;
}));

function _mockData() {
    return {
        ClientID: 'XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXX',
        Scope: ['DUMMY_SCOPE'],
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
            Password: "USER_PASSWORD",
            FirstName: 'USER_FIRSTNAME',
            LastName: "USER_LASTNAME",
            Email: "USER_EMAIL",
            Phone: "USER_PHONE",
            TermsAccepted: true,
            Active: true
        },
        Product: {
            ID: 'PRODUCT_ID'
        },
        Order: {
            ID: 'ORDER_ID'
        },
        Promotion: {
            Code:'Discount10'
        }
    }
}