angular.module('orderCloud')
    .config(function(ocRolesProvider) {
        var roleGroups = [
            {Name: 'BuyerRoles', Type: 'Any', Roles: ['BuyerReader', 'BuyerAdmin']},
            {Name: 'ProductRoles', Type: 'Any', Roles: ['ProductReader', 'ProductAdmin']},
            {Name: 'OrderRoles', Type: 'Any', Roles: ['OrderReader', 'OrderAdmin']},
            {Name: 'AdminUserRoles', Type: 'Any', Roles: ['AdminUserReader', 'AdminUserAdmin']},
            {Name: 'AdminUserGroupRoles', Type: 'Any', Roles: ['AdminUserGroupReader', 'AdminUserGroupAdmin']},
            {Name: 'BuyerUserRoles', Type: 'Any', Roles: ['BuyerUserReader', 'BuyerUserAdmin']},
            {Name: 'UserGroupRoles', Type: 'Any', Roles: ['UserGroupReader', 'UserGroupAdmin']},
            {Name: 'CategoryRoles', Type: 'Any', Roles: ['CategoryReader', 'CategoryAdmin']},
            {Name: 'AddressRoles', Type: 'Any', Roles: ['AddressReader', 'AddressAdmin']},
            {Name: 'CreditCardRoles', Type: 'Any', Roles: ['CreditCardReader', 'CreditCardAdmin']},
            {Name: 'SpendingAccountRoles', Type: 'Any', Roles: ['SpendingAccountReader', 'SpendingAccountAdmin']},
            {Name: 'CostCenterRoles', Type: 'Any', Roles: ['CostCenterReader', 'CostCenterAdmin']},
            {Name: 'ApprovalRuleRoles', Type: 'Any', Roles: ['ApprovalRuleReader', 'ApprovalRuleAdmin']},
            {Name: 'PromotionRoles', Type: 'Any', Roles: ['PromotionReader', 'PromotionAdmin']}
        ];

        angular.forEach(roleGroups, function(roleGroup) {
            ocRolesProvider.AddRoleGroup(roleGroup);
        });
    })
;