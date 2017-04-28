angular.module('orderCloud')
	.config(AccountConfig)
;

function AccountConfig($stateProvider) {
	$stateProvider
		.state('account', {
			parent: 'base',
			url: '/account',
			templateUrl: 'account/templates/account.html',
			controller: 'AccountCtrl',
			controllerAs: 'account',
			data: {
				pageTitle: "Account"
			}
		})
	;
}