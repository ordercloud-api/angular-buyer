angular.module('orderCloud')
    .factory('ocRolesService', OrderCloudRolesService)
    .provider('ocRoles', OrderCloudRolesProvider)
;

function OrderCloudRolesService($window, OrderCloud) {
    var service = {
        Set: _set,
        Get: _get,
        Remove: _remove,
        UserIsAuthorized: _userIsAuthorized
    };

    var roles;

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
        roles = decodedTokenObject.role;

        if (typeof roles == 'string') roles = [roles];

        return roles || [];
    }

    //Returns local service variable or obtains roles again from token
    function _get() {
        return roles || _set(OrderCloud.Auth.ReadToken());
    }

    //Removes local service variable
    function _remove() {
        roles = null;
    }

    //Returns boolean whether user's claimed roles cover a required array of roles
    function _userIsAuthorized(requiredRoles, any) {
        var userRoles = _get();
        if (!userRoles) return;
        if (userRoles.indexOf('FullAccess') > -1) {
            return true;
        }
        else if (any) {
            return _.intersection(requiredRoles, userRoles).length > 0;
        }
        else {
            return _.difference(requiredRoles, userRoles).length == 0;
        }
    }

    return service;
}

function OrderCloudRolesProvider() {
    var roleGroups = {};

    return {
        $get: function() {
             return {
                 GetRoleGroups: function() {
                    return roleGroups;
                 }
             }
        },
        AddRoleGroup: function(roleGroup) {
             if (!roleGroup.Name) throw "ocRoles: RoleGroup must have a Name value";
             if (!roleGroup.Roles || !roleGroup.Roles.length) throw "ocRoles: RoleGroup must have Roles";
             if (!angular.isArray(roleGroup.Roles)) throw "ocRoles: RoleGroup Roles must be an array";
             if (!roleGroup.Type || ['All', 'Any'].indexOf(roleGroup.Type) == -1) throw "ocRoles: RoleGroup Type must be 'All' or 'Any'";

             roleGroups[roleGroup.Name] = roleGroup;
        }
    }

}