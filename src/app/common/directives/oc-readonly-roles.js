angular.module('orderCloud')
    .directive('ocReadonlyRoles', OrderCloudReadonlyRoles)
    .directive('input', OrderCloudReadonlyRolesInput)
    .directive('textarea', OrderCloudReadonlyRolesTextArea)
    .directive('select', OrderCloudReadonlyRolesSelect)
    .directive('button', OrderCloudReadonlyRolesButton)
;

function OrderCloudReadonlyRoles(ocRoles, ocRolesService) {
    var directive = {
        restrict: 'A',
        controller: function($scope, $attrs, $element) {
            var vm = this;
            vm.Authorized = true;

            var attrValue = $attrs.ocReadonlyRoles;
            var roleGroups = ocRoles.GetRoleGroups();

            if (attrValue && !/[^a-z]/i.test(attrValue)) {
                if (roleGroups[attrValue]) {
                    //single string role group
                    var roleGroup = roleGroups[attrValue];
                    analyzeRoles(roleGroup.Roles, roleGroup.Type == 'Any');
                }
                else {
                    //single string role
                    analyzeRoles([attrValue]);
                }
            }
            else if (attrValue.split(' || ').length > 1) {
                //pipe delimited string values
                analyzeRoles(attrValue.split(' || '), true);
            }
            else {
                var value = JSON.parse($attrs.ocReadonlyRoles.replace(/'/g, '"'));
                if (angular.isArray(value) && value.length && (typeof value[0] == 'string')) {
                    //interpolated array value
                    analyzeRoles(value);
                }
            }

            function analyzeRoles(requiredRoles, any) {
                if (!ocRolesService.UserIsAuthorized(requiredRoles, any)) {
                    vm.Authorized = false;
                    $element.addClass('oc-read-only')
                } else {
                    $element.removeClass('oc-read-only');
                }
            }
        }
    };

    return directive;
}

function OrderCloudReadonlyRolesInput() {
    var directive = {
        restrict: 'E',
        priority: -1000,
        require: ['^?ocReadonlyRoles'],
        link: link
    };

    function link(scope, element, attr, ctrl) {
        var ocReadonlyRolesCtrl = ctrl[0];
        if (ocReadonlyRolesCtrl) {
            var authorized = ocReadonlyRolesCtrl.Authorized;

            if (!authorized) {
                if (element.attr('type') == 'checkbox' || attr['uibDatepickerPopup']) {
                    element.attr('disabled', true);
                }
                else {
                    element.attr('readonly', true);
                }
            }
        }
    }

    return directive;
}

function OrderCloudReadonlyRolesTextArea() {
    var directive = {
        restrict: 'E',
        priority: -1000,
        require: ['^?ocReadonlyRoles'],
        link: link
    };

    function link(scope, element, attr, ctrl) {
        var ocReadonlyRolesCtrl = ctrl[0];
        if (ocReadonlyRolesCtrl) {
            var authorized = ocReadonlyRolesCtrl.Authorized;

            if (!authorized) {
                element.attr('readonly', true);
            }
        }
    }

    return directive;
}

function OrderCloudReadonlyRolesSelect() {
    var directive = {
        restrict: 'E',
        require: ['^?ocReadonlyRoles'],
        link: link
    };

    function link(scope, element, attr, ctrl) {
        var ocReadonlyRolesCtrl = ctrl[0];
        if (ocReadonlyRolesCtrl) {
            var authorized = ocReadonlyRolesCtrl.Authorized;

            if (!authorized) {
                element.attr('disabled', true);
            }
        }
    }

    return directive;
}

function OrderCloudReadonlyRolesButton() {
    var directive = {
        restrict: 'E',
        priority: -1000,
        require: ['^?ocReadonlyRoles'],
        link: link
    };

    function link(scope, element, attr, ctrl) {
        var ocReadonlyRolesCtrl = ctrl[0];
        if (ocReadonlyRolesCtrl) {
            var authorized = ocReadonlyRolesCtrl.Authorized;

            if (!authorized && !element.attr('ng-disabled') && !element.hasClass('close')) {
                element.attr('disabled', true);
            }
        }
    }

    return directive;
}