angular.module('orderCloud')
    .directive('ocIfRoles', OrderCloudIfRoles);

/**
 * @ngdoc directive
 * @name ocIfRoles
 *
 * @description
 * Shows/hides elements based on user's roles and provided required roles.
 *
 *
 * @examples
 * 1) If only one role is required, provide that role as the directive attribute's value
 * <div oc-if-roles="BuyerAdmin"></div>
 *
 * 2) If multiple roles are required, provide an array with all roles listed as directive attribute's value
 * <div oc-if-roles="['BuyerAdmin', 'ProductAdmin']"></div>
 *
 * 3) If only one of numerous roles are required, provide a || delimited list of roles as directive attribute's value
 * <div oc-if-roles="BuyerAdmin || UserGroupAdmin || AddressReader"></div>
 *
 * 4) RoleGroup alias can be configured ahead of time using the ocRolesProvider -- RoleGroups can be configured to compare for ANY or ALL provided roles
 * <div oc-if-roles="MyGroupOfRoles"></div>
 * 
 * 5) Object notation similar to that used in ocNavItems can also be used. This can include multiple Roles and/or RoleGroups
 * <div oc-if-roles="{Items:['BuyerRoles', 'CatalogRoles'], Any:false}"></div>
 */

function OrderCloudIfRoles(ocRoles, $ocRoles) {
    var directive = {
        multiElement: true,
        restrict: 'A',
        priority: 599, //ngIf has priority 600 and terminal: true -- therefore, this directive is ignored if ngIf removes element
        link: link
    };

    function link(scope, element, attr) {
        //Use attr.ocIfRoles to avoid need for isolated scope
        var attrValue = attr.ocIfRoles;
        var roleGroups = $ocRoles.GetRoleGroups();
        var ocIfRolesObj = scope.$eval(attrValue);
        if (typeof ocIfRolesObj == 'object') {
            analyzeRoles(ocIfRolesObj.Items, ocIfRolesObj.Any);
        } else if (attrValue && !/[^a-z]/i.test(attrValue)) {
            if (roleGroups[attrValue]) {
                //single string role group
                var roleGroup = roleGroups[attrValue];
                analyzeRoles(roleGroup.Roles, roleGroup.Type === 'Any');
            } else {
                //single string role
                analyzeRoles([attrValue]);
            }
        } else if (attrValue.split(' || ').length > 1) {
            //pipe delimited string values
            analyzeRoles(attrValue.split(' || '), true);
        } else {
            scope.$watch('ocIfRoles', function ocIfWatchAction(value) {
                if (angular.isArray(value) && value.length && (typeof value[0] == 'string')) {
                    //interpolated array value
                    analyzeRoles(value);
                }
            });
        }

        function analyzeRoles(requiredRoles, any) {
            if (!ocRoles.UserIsAuthorized(requiredRoles, any)) {
                removeElement();
            }
        }

        function removeElement() {
            element.before('<!-- ocIfPermissions: ' + attr.ocIfRoles + ' -->');
            element.remove();
        }
    }

    return directive;
}