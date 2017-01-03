xdescribe('Component: Repeat Order', function() {
    var scope,
        q,
        scope,
        oc,
        repeatFactory,
        toaster,
        mockOrderID,
        mockClientID,
        mockClaims,
        mockAdminToken
        ;
    beforeEach(module('orderCloud'));
    beforeEach(module('orderCloud.sdk'));
    beforeEach(inject(function($q, $rootScope, OrderCloud, toastr, RepeatOrderFactory) {
        q = $q;
        scope = $rootScope.$new();
        oc = OrderCloud;
        repeatFactory = RepeatOrderFactory;
        toaster = toastr;
        mockOrderID = 'TestOrder123456789';
        mockClientID = 'DA2C5842-CD7E-459A-BC63-72554DAD1FBB';
        mockClaims = 'FullAccess';
    }));
    describe('Controller: RepeatOrderCtrl', function() {
        var repeatOrderCtrl,
            mockBuyerToken
            ;
        beforeEach(inject(function($state, $controller, RepeatOrderFactory) {
            repeatOrderCtrl = $controller('RepeatOrderCtrl', {
                $scope: scope,
                repeatFactory: RepeatOrderFactory
            });
            spyOn($state, 'go');
            mockBuyerToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c3IiOiJjcmFtaXJleiIsImNpZCI6ImRlMmYzMDllLWIwOTgtNGM1ZC05NTlmLTBiMWViZTMxNTYzZCIsInVzcnR5cGUiOiJidXllciIsInJvbGUiOiJGdWxsQWNjZXNzIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLm9yZGVyY2xvdWQuaW8iLCJhdWQiOiJodHRwczovL2FwaS5vcmRlcmNsb3VkLmlvIiwiZXhwIjoxNDYxODE0MTg3LCJuYmYiOjE0NjE3NzgyNDd9.cx_KiNLV-dtDCQi4OkaP9x8QHXfTLQyFBlBMDPpk5KI';
            mockAdminToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c3IiOiJ6ZW8iLCJjaWQiOiJkYTJjNTg0Mi1jZDdlLTQ1OWEtYmM2My03MjU1NGRhZDFmYmIiLCJ1c3J0eXBlIjoiYWRtaW4iLCJyb2xlIjoiRnVsbEFjY2VzcyIsImlzcyI6Imh0dHBzOi8vYXV0aC5vcmRlcmNsb3VkLmlvIiwiYXVkIjoiaHR0cHM6Ly9hcGkub3JkZXJjbG91ZC5pbyIsImV4cCI6MTQ2MTg5NDg0MywibmJmIjoxNDYxODY0ODQzfQ.Kx0e03Idjq9ZEQ-5-MfbwmHazRCN6kRG_Bw2qk-lKes';
        }));
        describe('reorder', function() {
            beforeEach(function() {
                var defer = q.defer();
                defer.resolve();
                spyOn(toaster, 'error');
                spyOn(toaster,'success');
                spyOn(repeatFactory, 'SetAccessToken').and.returnValue(defer.promise);
                spyOn(repeatFactory, 'CheckLineItemsValid').and.returnValue(defer.promise);
                spyOn(repeatFactory, 'GetCurrentOrderLineItems').and.returnValue(defer.promise);
                spyOn(repeatFactory, 'Reorder').and.returnValue(defer.promise);
                spyOn(repeatFactory, 'SuccessConfirmation')
            });
            describe('as a buyer', function() {
                beforeEach(function() {
                    repeatOrderCtrl.userType = 'buyer';
                    spyOn(oc.Auth, 'ReadToken').and.returnValue(mockBuyerToken);
                });
                it('should display correct error toaster if buyer has no orderid', function() {
                    repeatOrderCtrl.reorder(null, 'true', 'true', mockClientID, '999', mockClaims);
                    expect(toaster.error).toHaveBeenCalledWith('This directive is not configured correctly. orderID is a required attribute', 'Error');
                });

                it('should call the RepeatOrderFactory SetAccessToken method', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', mockClientID, '999', mockClaims);
                    expect(repeatFactory.SetAccessToken).toHaveBeenCalledWith('buyer', '999', mockClientID, mockClaims);
                });
                it('should call the RepeatOrderFactory CheckLineItemsValid method', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', mockClientID, '999', mockClaims);
                    scope.$digest();
                    expect(repeatFactory.CheckLineItemsValid).toHaveBeenCalledWith('buyer', mockOrderID);
                });
                it('should call the RepeatOrderFactory GetCurrentOrderLineItems method', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', mockClientID, '999', mockClaims);
                    scope.$digest();
                    expect(repeatFactory.GetCurrentOrderLineItems).toHaveBeenCalled();
                });
                it('should call the RepeatOrderFactory Reorder method', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', mockClientID, '999', mockClaims);
                    scope.$digest();
                    expect(repeatFactory.Reorder).toHaveBeenCalled();
                });
                it('should call the RepeatOrderFactory SuccessConfirmation method', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', mockClientID, '999', mockClaims);
                    scope.$digest();
                    expect(repeatFactory.SuccessConfirmation).toHaveBeenCalled();
                })
            });
            describe('as an admin', function() {
                beforeEach(function() {
                    repeatOrderCtrl.userType = 'admin';
                    spyOn(oc.Auth, 'ReadToken').and.returnValue(mockAdminToken);
                });
                it('should display correct error toaster if admin has no orderid', function() {
                    repeatOrderCtrl.reorder(null, 'true', 'true', mockClientID, '999', mockClaims);
                    expect(toaster.error).toHaveBeenCalledWith('This directive is not configured correctly. orderID and clientID are required attributes', 'Error');
                });
                it('should display correct error toaster if admin has no clientID', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', null, '999', mockClaims);
                    expect(toaster.error).toHaveBeenCalledWith('This directive is not configured correctly. orderID and clientID are required attributes', 'Error');
                });
                it('should call the RepeatOrderFactory SetAccessToken method', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', mockClientID, '999', mockClaims);
                    expect(repeatFactory.SetAccessToken).toHaveBeenCalledWith('admin', '999', mockClientID, mockClaims);
                });
                it('should call the RepeatOrderFactory CheckLineItemsValid method', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', mockClientID, '999', mockClaims);
                    scope.$digest();
                    expect(repeatFactory.CheckLineItemsValid).toHaveBeenCalledWith('admin', mockOrderID);
                });
                it('should call the RepeatOrderFactory GetCurrentOrderLineItems method', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', mockClientID, '999', mockClaims);
                    scope.$digest();
                    expect(repeatFactory.GetCurrentOrderLineItems).toHaveBeenCalled();
                });
                it('should call the RepeatOrderFactory Reorder method', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', mockClientID, '999', mockClaims);
                    scope.$digest();
                    expect(repeatFactory.Reorder).toHaveBeenCalled();
                });
                it('should call the RepeatOrderFactory SuccessConfirmation method', function() {
                    repeatOrderCtrl.reorder(mockOrderID, 'true', 'true', mockClientID, '999', mockClaims);
                    scope.$digest();
                    expect(repeatFactory.SuccessConfirmation).toHaveBeenCalled();
                })
            });
        })
    });
    describe('Factory: RepeatOrderFactory', function() {
        var mockToken,
            mockTokenRequest,
            mockProductList,
            AllValidLineItemList,
            SomeValidLineItemList,
            InvalidLineItemList,
            LIHelpers
            ;
        beforeEach(inject(function(LineItemHelpers) {
            LIHelpers = LineItemHelpers;
            mockProductList = {
                "Meta": {"TotalPages": 1, "Page": 1},
                "Items": [
                    {"ID": "ProductID12345","Name": "Product"}
                ]
            };
            AllValidLineItemList =[{
                "ID": "LineItemID123",
                "ProductID": "ProductID12345",
                "ShippingAddress":"FakeAddress1"
            }];

            SomeValidLineItemList = [{
                "ID": "LineItemID1234",
                "ProductID": "ProductID12345",
                "ShippingAddressID": "FakeAddress2"
            }, {
                "ID": "LineItemID123456",
                "ProductID": "ProductID123",
                "ShippingAddress":"FakeAddress3"
            }];

            InvalidLineItemList = [{
                "ID": "LineItemID12345",
                "ProductID": "ProductID123",
                "ShippingAddress":"FakeAddress4"
            }];
        }));
        describe('SetAccessToken', function() {
            beforeEach(function() {
                mockToken = {
                    $promise: "Promise",
                    $resolved: true,
                    access_token: mockAdminToken,
                    expires_in:3600,
                    token_type: 'bearer'
                };
                var defer = q.defer();
                defer.resolve(mockToken);
                spyOn(oc.Users, 'GetAccessToken').and.returnValue(defer.promise);
                spyOn(oc.Auth, 'SetImpersonationToken').and.returnValue(defer.promise);
            });
            describe('as an admin', function() {
                beforeEach(function() {
                    mockTokenRequest = {clientID: mockClientID, Claims: [mockClaims]};
                    repeatFactory.SetAccessToken('admin', '999', mockClientID, mockClaims);
                    scope.$digest();
                });
                it('should call the GetAccessToken method', function() {
                    expect(oc.Users.GetAccessToken).toHaveBeenCalledWith('999', mockTokenRequest);
                });
                it('should call the SetAccessToken method', function() {
                    expect(oc.Auth.SetImpersonationToken).toHaveBeenCalledWith(mockAdminToken);
                })
            });
            describe('as a buyer', function() {
                beforeEach(function() {
                    repeatFactory.SetAccessToken('buyer', '999', mockClientID, mockClaims);
                    scope.$digest();
                });
                it('should not call the GetAccessToken method', function() {
                    expect(oc.Users.GetAccessToken).not.toHaveBeenCalled();
                });
                it('should not call the SetAccessToken method', function() {
                    expect(oc.Auth.SetImpersonationToken).not.toHaveBeenCalled();
                });
            })
        });
        describe('CheckLineItemsValid', function() {
            var productListdefer,
                validLIdefer,
                invalidLIdefer,
                someValidLIdefer
                ;

            beforeEach(function() {
                productListdefer = q.defer();
                productListdefer.resolve(mockProductList);

                spyOn(oc, 'As').and.returnValue(oc);
                spyOn(oc.Me, 'ListProducts').and.returnValue(productListdefer.promise);
                spyOn(toaster, 'warning');
                spyOn(toaster, 'error');

                validLIdefer = q.defer();
                validLIdefer.resolve(AllValidLineItemList);

                invalidLIdefer = q.defer();
                invalidLIdefer.resolve(InvalidLineItemList);

                someValidLIdefer = q.defer();
                someValidLIdefer.resolve(SomeValidLineItemList);
            });
            it('as an admin it should call Me ListProducts using impersonation', function() {
                spyOn(LIHelpers, 'ListAll').and.returnValue(validLIdefer.promise);
                repeatFactory.CheckLineItemsValid('admin', mockOrderID);
                expect(oc.As).toHaveBeenCalled();
                expect(oc.Me.ListProducts).toHaveBeenCalledWith(null, 1, 100);
            });
            it('as a buyer it should call Me ListProducts', function() {
                spyOn(LIHelpers, 'ListAll').and.returnValue(validLIdefer.promise);
                repeatFactory.CheckLineItemsValid('buyer', mockOrderID);
                scope.$digest();
                expect(oc.Me.ListProducts).toHaveBeenCalledWith(null,1,100);
                expect(toaster.error).not.toHaveBeenCalled();
            });
            it('should display warning toaster if some of the line items are invalid', function() {
                spyOn(LIHelpers, 'ListAll').and.returnValue(someValidLIdefer.promise);
                repeatFactory.CheckLineItemsValid('buyer', mockOrderID);
                scope.$digest();
                expect(toaster.warning).toHaveBeenCalledWith("There are 1 productDetail(s) in your cart that either no longer exist or you do not have permission to reorder, the order will process only with the products you are able to order. The ID's of the products that have been excluded are: ProductID123");
            });

        });
        describe('GetCurrentOrderLineItems', function() {
            beforeEach(inject(function($localForage, appname) {
                localForage = $localForage;
                appName = appname;

                var localForagedefer = q.defer();
                localForagedefer.resolve(mockOrderID);

                var LIHelperdefer = q.defer();
                LIHelperdefer.resolve(SomeValidLineItemList);

                spyOn(localForage, 'getItem').and.returnValue(localForagedefer.promise);
                spyOn(LIHelpers, 'ListAll').and.returnValue(LIHelperdefer.promise);
                spyOn(toaster, 'warning');
                repeatFactory.GetCurrentOrderLineItems(AllValidLineItemList);
                scope.$digest();
            }));
            it('should check LocalForage for an orderID', function() {
                expect(localForage.getItem).toHaveBeenCalledWith(appName + '.CurrentOrderID');
            });
            it('should call LineItemHelpers List all to retrieve the line items', function() {
                expect(LIHelpers.ListAll).toHaveBeenCalledWith(mockOrderID);
            });
            it('If there are line items currently in cart it should display a warning that they were added to reorder', function() {
                expect(toaster.warning).toHaveBeenCalledWith('The line items from your current order were added to this reorder.', 'Please be advised')
            })
        });
        describe('Reorder', function() {
            var currentorder,
                totalLineItems,
                mockBillingAddress,
                mockOrder
                ;
            beforeEach(inject(function(CurrentOrder) {
                currentorder = CurrentOrder;
                totalLineItems = [AllValidLineItemList, SomeValidLineItemList, InvalidLineItemList];
                mockBillingAddress = {
                    "Street1": "Apple Lane",
                    "City": "Minneapolis",
                    "State": "MN",
                    "Zip": "55414",
                    "Country": "US"
                };
                mockOrder = {
                    "ID": mockOrderID,
                    "BillingAddress": mockBillingAddress
                };
                var orderGetDefer = q.defer();
                orderGetDefer.resolve(mockOrder);

                var orderCreateDefer = q.defer();
                orderCreateDefer.resolve(mockOrder);

                var LineItemCreateDefer = q.defer();
                LineItemCreateDefer.resolve();

                spyOn(oc.Orders,'Get').and.returnValue(orderGetDefer.promise);
                spyOn(oc, 'As').and.returnValue(oc);
                spyOn(oc.Orders, 'Create').and.returnValue(orderCreateDefer.promise);
                spyOn(currentorder, 'Set');
                spyOn(oc.Orders, 'SetBillingAddress');
                spyOn(oc.LineItems, 'Create').and.returnValue(LineItemCreateDefer.promise);
            }));
            describe('as an admin', function() {
                beforeEach(function() {
                    repeatFactory.Reorder(mockOrderID, true, true, totalLineItems, 'admin');
                    scope.$digest();
                });
                it('should call Orders Get method', function() {
                    expect(oc.Orders.Get).toHaveBeenCalledWith(mockOrderID)
                });
                it('should call Orders Create method using impersonation', function() {
                    expect(oc.As).toHaveBeenCalled();
                    expect(oc.Orders.Create).toHaveBeenCalledWith({});
                });
                it('should call Orders SetBillingAddress', function() {
                    expect(oc.Orders.SetBillingAddress).toHaveBeenCalledWith(mockOrderID, mockBillingAddress);
                })
            });
            describe('as a buyer', function() {
                beforeEach(function() {
                    repeatFactory.Reorder(mockOrderID, true, true, totalLineItems, 'buyer');
                    scope.$digest();
                });
                it('should call Orders Get method', function() {
                    expect(oc.Orders.Get).toHaveBeenCalledWith(mockOrderID)
                });
                it('should call Orders Create method without using impersonation', function() {
                    expect(oc.As).not.toHaveBeenCalled();
                    expect(oc.Orders.Create).toHaveBeenCalledWith({});
                });
                it('should call Orders SetBillingAddress', function() {
                    expect(oc.Orders.SetBillingAddress).toHaveBeenCalledWith(mockOrderID, mockBillingAddress);
                })
            })
        });
        describe('SuccessConfirmation', function() {
            beforeEach(inject(function($state) {
                state = $state;
                spyOn(state, 'go');
                spyOn(toaster, 'success');
            }));
            mockSuccessOrder = {
                ID:'orderID12345',
                orderdata:'mockData'
            };
            it('should take me to checkout if buyer with includeBilling or includeShipping set to true', function() {
                repeatFactory.SuccessConfirmation(mockSuccessOrder, 'buyer', true, true);
                expect(state.go).toHaveBeenCalledWith('checkout');
            });
            it('should take me to cart if includeBilling and includeShipping are set to false', function() {
                repeatFactory.SuccessConfirmation(mockSuccessOrder, 'buyer', false, false);
                expect(state.go).toHaveBeenCalledWith('cart')
            });
            it('should take me to orderHistory if admin', function() {
                repeatFactory.SuccessConfirmation(mockSuccessOrder, 'admin', false, false);
                expect(state.go).toHaveBeenCalledWith('orderHistory');
            });
            it('should display success toastr with order number if admin', function() {
                repeatFactory.SuccessConfirmation(mockSuccessOrder, 'admin', false, false);
                expect(toaster.success).toHaveBeenCalledWith('Your reorder was successfully placed! The new order number is: orderID12345');
            })
        })
    });
    describe('Directive: ordercloudRepeatOrder', function() {
        var element;
        beforeEach(inject(function($compile) {
            element = $compile(' <ordercloud-repeat-order orderid="Order12345" clientid="DE2F309E-B098-4C5D-959F-0B1EBE31563D" fromuserid="999" includebilling="true" includeshipping="false" ></ordercloud-repeat-order>')(scope);
            scope.$digest();
        }));
        it('should initialize the isolate scope', function() {
            expect(element.isolateScope().orderid).toBe('Order12345');
            expect(element.isolateScope().clientid).toBe('DE2F309E-B098-4C5D-959F-0B1EBE31563D');
            expect(element.isolateScope().fromuserid).toBe('999');
            expect(element.isolateScope().includebilling).toBe('true');
            expect(element.isolateScope().includeshipping).toBe('true');
        });
    });
});
