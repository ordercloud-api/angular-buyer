var q,
    rootScope,
    scope,
    state,
    injector,
    exceptionHandler,
    toastrService,
    oc,
    parametersResolve,
    ocAppNameService,
    ocConfirmService,
    ocParametersService,
    dummyPromise,
    mock = _mockData();
beforeEach(module('orderCloud', function($provide) {
    $provide.value('ocStateLoading', {
        'Init': jasmine.createSpy()
    });
    $provide.value('CurrentOrder', mock.Order);
    $provide.value('catalogid', mock.Catalog.ID);
    $provide.value('Parameters', mock.Parameters)
}));
beforeEach(module('ordercloud-angular-sdk'));
beforeEach(inject(function($q, $rootScope, $state, $injector, $exceptionHandler, toastr, OrderCloudSDK, ocAppName, ocConfirm, ocParameters, Parameters) {
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
    ocParametersService = ocParameters;
    parametersResolve = Parameters;
    var defer = $q.defer();
    defer.resolve('DUMMY_RESPONSE');
    dummyPromise = defer.promise;
}));

function _mockData() {
    return {
        ClientID: 'XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXX',
        Scope: ['DUMMY_SCOPE'],
        Parameters: {
            search: null,
            page: null,
            pageSize: null,
            searchOn: null,
            sortBy: null,
            filters: null,
            catalogID: null,
            categoryID: null,
            categoryPage: null,
            productPage: null
        },
        Meta: {
            Page: 1,
            PageSize: 20,
            TotalCount:29,
            TotalPages: 3,
            ItemRange : [1,2]
        },
        Catalog: {
            ID: 'CATALOG_ID'
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
        Category: {
            ID: 'CATEGORY_ID'
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