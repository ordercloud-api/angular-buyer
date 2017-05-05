angular.module('orderCloud')
    .factory('ocRoles', OrderCloudRolesService)
    .provider('$ocRoles', OrderCloudRolesProvider)
;

function OrderCloudRolesService($window, $cookies, $ocRoles, OrderCloudSDK, ocAppName) {
    var service = {
        Set: _set,
        Get: _get,
        UserIsAuthorized: _userIsAuthorized
    };

    var cookieName = ocAppName.Watch().replace(/ /g, '_').toLowerCase() + '_roles';

    function base64Decode(string) {
        var output = string.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: { break; }
            case 2: { output += '=='; break; }
            case 3: { output += '='; break; }
            default: {
                console.warn('Illegal base64url string');
                return;
            }
        }
        return $window.decodeURIComponent(escape($window.atob(output))); //polyfill https://github.com/davidchambers/Base64.js
    }

    //Parse roles array from token and store as local service variable
    function _set(token) {
        if (!token) return;

        var tokenParts = token.split('.');

        if (tokenParts.length != 3) {
            console.warn('ocRoles', 'Token is not valid');
            return;
        }

        var decodedToken = base64Decode(tokenParts[1]);
        if (!decodedToken) {
            console.warn('ocRoles', 'Cannot decode token');
            return;
        }

        var decodedTokenObject = JSON.parse(decodedToken);
        var roles = decodedTokenObject.role;

        if (typeof roles == 'string') roles = [roles];
        $cookies.putObject(cookieName, {Roles: roles});

        return roles || [];
    }

    //Returns local service variable or obtains roles again from token
    function _get() {
        var cookie = $cookies.getObject(cookieName);
        return cookie ? cookie.Roles : _set(OrderCloudSDK.GetToken());
    }

    //Returns boolean whether user's claimed roles cover a array of roles and/or Role Groups
    //Role Groups use the group's Type setting. Individual roles use the any parameter when combined
    //Ex: ocRoles.UserIsAuthorized(['CategoryReader', 'CatalogReader', 'RoleGroupA'], true);
        //Evaluates whether user is authorized for RoleGroupA's configuration AND has either CategoryReader or CatalogReader
    function _userIsAuthorized(roleItems, any) {
        var userRoles = _get();
        
        if (!userRoles) return;
        if (userRoles.indexOf('FullAccess') > -1) return true;

        function analyzeRoles(roles, hasAny) {
            if (hasAny) {
                return _.intersection(roles, userRoles).length > 0;
            } else {
                return _.difference(roles, userRoles).length === 0;
            }
        }

        var authorized = false;
        var roleGroups = $ocRoles.GetRoleGroups();
        var roles = [];
        
        angular.forEach(roleItems, function(item) {
            if (authorized && any) return;
            if (roleGroups[item]) {
                var roleGroup = roleGroups[item];
                authorized = analyzeRoles(roleGroup.Roles, roleGroup.Type === 'Any');
            } 
            else {
                roles.push(item);
            }
        });
        if (authorized && any) return authorized;
        if ((!authorized || !any) && roles.length) authorized = analyzeRoles(roles, any);

        return authorized;
    }

    return service;
}

function OrderCloudRolesProvider(scope) {
    var roleGroups = {};

    return {
        $get: function() {
             return {
                 GetRoleGroups: function() {
                    return roleGroups;
                 }
             };
        },
        AddRoleGroup: function(roleGroup) {
             if (!roleGroup.Name) throw 'ocRoles: RoleGroup must have a Name value';
             if (scope.indexOf(roleGroup.Name) > -1) throw 'ocRole: RoleGroup Name cannot match an OrderCloud role name: ' + roleGroup.Name;
             if (!roleGroup.Roles || !roleGroup.Roles.length) throw 'ocRoles: RoleGroup must have Roles';
             if (!angular.isArray(roleGroup.Roles)) throw 'ocRoles: RoleGroup Roles must be an array';
             if (!roleGroup.Type || ['All', 'Any'].indexOf(roleGroup.Type) == -1) throw 'ocRoles: RoleGroup Type must be \'All\' or \'Any\'';

             roleGroups[roleGroup.Name] = roleGroup;
        }
    };

}