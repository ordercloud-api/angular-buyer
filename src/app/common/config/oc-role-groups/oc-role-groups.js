angular.module('orderCloud')
    .config(function($ocRolesProvider) {
        var roleGroups = [
            {Name: 'AddressRoles',              Type: 'Any', Roles: ['AddressReader', 'AddressAdmin']}, //For both seller & buyer address management
            {Name: 'ApprovalRuleRoles',         Type: 'Any', Roles: ['ApprovalRuleReader', 'ApprovalRuleAdmin']},
            {Name: 'BuyerRoles',                Type: 'Any', Roles: ['BuyerReader', 'BuyerAdmin']},
            {Name: 'BuyerUserRoles',            Type: 'Any', Roles: ['BuyerUserReader', 'BuyerUserAdmin']},
            {Name: 'CatalogRoles',              Type: 'Any', Roles: ['CatalogReader', 'CatalogAdmin']},
            {Name: 'CategoryRoles',             Type: 'Any', Roles: ['CategoryReader', 'CategoryAdmin']},
            {Name: 'CostCenterRoles',           Type: 'Any', Roles: ['CostCenterReader', 'CostCenterAdmin']},
            {Name: 'CreditCardRoles',           Type: 'Any', Roles: ['CreditCardReader', 'CreditCardAdmin']},
            {Name: 'OrderRoles',                Type: 'Any', Roles: ['OrderReader', 'OrderAdmin']},
            {Name: 'PriceScheduleRoles',        Type: 'Any', Roles: ['PriceScheduleReader', 'PriceScheduleAdmin']},
            {Name: 'PromotionRoles',            Type: 'Any', Roles: ['PromotionReader', 'PromotionAdmin']},
            {Name: 'ProductRoles',              Type: 'Any', Roles: ['ProductReader', 'ProductAdmin']},
            {Name: 'SellerUserGroupRoles',      Type: 'Any', Roles: ['AdminUserGroupReader', 'AdminUserGroupAdmin']},
            {Name: 'SellerUserRoles',           Type: 'Any', Roles: ['AdminUserReader', 'AdminUserAdmin']},
            {Name: 'ShipmentRoles',             Type: 'Any', Roles: ['ShipmentReader', 'ShipmentAdmin']},
            {Name: 'SpendingAccountRoles',      Type: 'Any', Roles: ['SpendingAccountReader', 'SpendingAccountAdmin']},
            {Name: 'SupplierRoles',             Type: 'Any', Roles: ['SupplierReader', 'SupplierAdmin']},
            {Name: 'SupplierUserGroupRoles',    Type: 'Any', Roles: ['SupplierUserGroupReader', 'SupplierUserGroupAdmin']},
            {Name: 'SupplierUserRoles',         Type: 'Any', Roles: ['SupplierUserReader', 'SupplierUserAdmin']},
            {Name: 'UserGroupRoles',            Type: 'Any', Roles: ['UserGroupReader', 'UserGroupAdmin']}
        ];

        angular.forEach(roleGroups, function(roleGroup) {
            $ocRolesProvider.AddRoleGroup(roleGroup);
        });
    })
;