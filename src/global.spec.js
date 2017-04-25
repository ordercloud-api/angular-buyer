var q,
    rootScope,
    scope,
    state,
    injector,
    exceptionHandler,
    toastrService,
    oc,
    ocAppNameService,
    ocConfirmService,
    dummyPromise,
    mock = _mockData();
beforeEach(module('orderCloud', function($provide) {
    $provide.value('ocStateLoading', {
        'Init': jasmine.createSpy()
    });
    $provide.value('CurrentOrder', mock.Order);
}));
beforeEach(module('ordercloud-angular-sdk'));
beforeEach(inject(function($q, $rootScope, $state, $injector, $exceptionHandler, toastr, OrderCloudSDK, ocAppName, ocConfirm) {
    q = $q;
    scope = $rootScope.$new();
    rootScope = $rootScope;
    state = $state;
    injector = $injector;
    toastrService = toastr;
    oc = OrderCloudSDK;
    exceptionHandler = $exceptionHandler;
    ocAppNameService = ocAppName;
    ocConfirmService = ocConfirm;
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
        Meta: {
            Page: 1,
            PageSize: 20,
            TotalCount:29,
            TotalPages: 3,
            ItemRange : [1,2]
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
            ID: 'ORDER_ID',
            Type: "ORDER_TYPE",
            FromUserID: "ORDER_FROM_USER_ID",
            BillingAddressID: "ORDER_BILLING_ADDRESS_ID",
            ShippingAddressID: "ORDER_SHIPPING_ADDRESS_ID",
            SpendingAccountID: null,
            Comments: null,
            PaymentMethod: null,
            CreditCardID: null,
            ShippingCost: null,
            TaxCost: null
        },
        LineItem: {
            ID: 'LINEITEM_ID'
        },
        Promotion: {
            Code:'Discount10'
        }
    }
}