var q,
    rootScope,
    compile,
    scope,
    state,
    injector,
    exceptionHandler,
    toastrService,
    uibModalService,
    oc,
    parametersResolve,
    currentOrder,
    currentUser,
    orderLineItems,
    ocLineItemsService,
    ocAppNameService,
    ocConfirmService,
    ocMyAddressesService,
    ocParametersService,
    ocProductQuickViewService,
    ocRolesService,
    ocReorderService,
    dummyPromise,
    mock = _mockData();
beforeEach(module('orderCloud', function($provide) {
    $provide.value('ocStateLoading', {
        'Init': jasmine.createSpy()
    });
    $provide.value('CurrentUser', mock.User);
    $provide.value('CurrentOrder', mock.Order);
    $provide.value('Parameters', mock.Parameters);
    $provide.value('OrderLineItems', mock.LineItems);
}));
beforeEach(module('ordercloud-angular-sdk'));
beforeEach(inject(function($q, $rootScope, $compile, $state, $injector, $exceptionHandler, toastr, $uibModal,
OrderCloudSDK, ocLineItems, ocAppName, ocConfirm, ocMyAddresses, ocParameters, ocRoles, ocReorder, Parameters, 
ocProductQuickView, CurrentOrder, CurrentUser, OrderLineItems) {
    q = $q;
    scope = $rootScope.$new();
    rootScope = $rootScope;
    compile = $compile;
    state = $state;
    injector = $injector;
    toastrService = toastr;
    uibModalService = $uibModal;
    oc = OrderCloudSDK;
    exceptionHandler = $exceptionHandler;
    ocLineItemsService = ocLineItems;
    ocAppNameService = ocAppName;
    ocConfirmService = ocConfirm;
    ocMyAddressesService = ocMyAddresses;
    ocParametersService = ocParameters;
    ocProductQuickViewService = ocProductQuickView;
    ocRolesService = ocRoles;
    ocReorderService = ocReorder;
    parametersResolve = Parameters;
    currentOrder = CurrentOrder;
    currentUser = CurrentUser;
    orderLineItems = OrderLineItems;
    var defer = $q.defer();
    defer.resolve('FAKE_RESPONSE');
    dummyPromise = defer.promise;
}));

function _mockData() {
    return {
        OauthResponse: {
            access_token: 'FAKE_ACCESS_TOKEN',
            refresh_token: 'FAKE_REFRESH_TOKEN'
        },
        DefaultState: 'DEFAULT_STATE',
        ClientID: 'FAKE_CLIENT_ID',
        Scope: ['FAKE_SCOPE'],
        Parameters: {
            search: null,
            page: null,
            pageSize: null,
            searchOn: null,
            sortBy: null,
            filters: {},
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
            Active: true,
            xp: {
                FavoriteProducts: ['FavProd1', 'FavProd2'],
                FavoriteOrders: ['FavOrder1', 'FavOrder2']
            },
            Buyer: {
                ID: 'BUYER_ID',
                DefaultCatalogID: 'BUYER_DEFAULT_CATALOG_ID'
            }
        },
        Product: {
            ID: 'PRODUCT_ID',
            Name: 'PRODUCT_NAME',
            PriceSchedule: {
                PriceBreaks: [
                    {
                        Price: '$0.00',
                        Quantity: 1
                    },
                    {
                        Price: '$0.00',
                        Quantity: 1
                    }
                ]
            }
        },
        Products: {
            Items: [
                {ID: 'testProd1'},
                {ID: 'testProd2'}
            ]
        },
        Category: {
            ID: 'CATEGORY_ID'
        },
        Categories: {
            Items: [
                {ID: 'mockCat1'},
                {ID: 'mockCat2'}
            ]
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
            TaxCost: null,
            Total: 100
        },
        LineItem: {
            ID: 'LINEITEM_ID',
            Product: {
                ID: 'MOCK_PRODUCT_ID'
            },
            Quantity: 3
        },
        Payment: {
            ID: 'PAYMENT_ID',
            Amount: 150
        },
        Promotion: {
            Code:'Discount10'
        },
        CreditCard: {
            "ID": "testCompanyACard",
            "Editable": true,
            "Token": null,
            "DateCreated": "2016-12-07T17:49:28.73+00:00",
            "CardType": "visa",
            "PartialAccountNumber": "123",
            "CardholderName": "CompanyA",
            "ExpirationDate": "2016-02-20T00:00:00+00:00",
            "xp": null
        },
        SpendingAcct: {
            "ID": "1bXwQHDke0SF4LRPzCpDcQ",
            "Name": "Gift Card Expires Next Month",
            "Balance": 20,
            "AllowAsPaymentMethod": true,
            "RedemptionCode": null,
            "StartDate": "2016-12-01T00:00:00+00:00",
            "EndDate": "2017-02-02T00:00:00+00:00",
            "xp": null
        },
        GiftCard: {
            "ID": "1bXwQHDke0SF4LRPzCpDcQ",
            "Name": "Gift Card Expires Next Month",
            "Balance": 20,
            "AllowAsPaymentMethod": true,
            "RedemptionCode": "Hello",
            "StartDate": "2016-12-01T00:00:00+00:00",
            "EndDate": "2017-02-02T00:00:00+00:00",
            "xp": null
        }
    }
}