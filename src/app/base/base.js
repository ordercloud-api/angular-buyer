angular.module( 'orderCloud' )

    .config( BaseConfig )
    .controller( 'BaseCtrl', BaseController )
    .controller( 'BaseLeftCtrl', BaseLeftController )
    .controller( 'BaseTopCtrl', BaseTopController )
;

function BaseConfig( $stateProvider ) {
    $stateProvider
        .state( 'base', {
            url: '',
            abstract: true,
            templateUrl:'base/templates/base.tpl.html',
            views: {
                '': {
                    templateUrl: 'base/templates/base.tpl.html',
                    controller: 'BaseCtrl',
                    controllerAs: 'base'
                },
                'top@base': {
                    templateUrl: 'base/templates/base.top.tpl.html',
                    controller: 'BaseTopCtrl',
                    controllerAs: 'baseTop'
                },
                'left@base': {
                    templateUrl: 'base/templates/base.left.tpl.html',
                    controller: 'BaseLeftCtrl',
                    controllerAs: 'baseLeft'
                }
            },
            resolve: {
                CurrentUser: function($q, $state, OrderCloud) {
                    var dfd = $q.defer();
                    OrderCloud.Me.Get()
                        .then(function(data) {
                            dfd.resolve(data);
                        })
                        .catch(function(){
                            OrderCloud.Auth.RemoveToken();
                            OrderCloud.Auth.RemoveImpersonationToken();
                            OrderCloud.BuyerID.Set(null);
                            $state.go('login');
                            dfd.resolve();
                        });
                    return dfd.promise;
                },
                ComponentList: function($state, $q, Underscore, CurrentUser) {
                    var deferred = $q.defer();
                    var nonSpecific = ['Products', 'Specs', 'Price Schedules', 'Admin Users'];
                    var components = {
                        nonSpecific: [],
                        buyerSpecific: []
                    };
                    angular.forEach($state.get(), function(state) {
                        if (!state.data || !state.data.componentName) return;
                        if (nonSpecific.indexOf(state.data.componentName) > -1) {
                            if (Underscore.findWhere(components.nonSpecific, {Display: state.data.componentName}) == undefined) {
                                components.nonSpecific.push({
                                    Display: state.data.componentName,
                                    StateRef: state.name
                                });
                            }
                        } else {
                            if (Underscore.findWhere(components.buyerSpecific, {Display: state.data.componentName}) == undefined) {
                                components.buyerSpecific.push({
                                    Display: state.data.componentName,
                                    StateRef: state.name
                                });
                            }
                        }
                    });
                    deferred.resolve(components);
                    return deferred.promise;
                }
            }
        });
}

function BaseController(CurrentUser) {
    var vm = this;
    vm.currentUser = CurrentUser;
}

function BaseLeftController(ComponentList) {
    var vm = this;
    vm.catalogItems = ComponentList.nonSpecific;
    vm.organizationItems = ComponentList.buyerSpecific;
}

function BaseTopController() {
    var vm = this;
}
