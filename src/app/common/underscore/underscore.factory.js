angular.module('orderCloud')
	.factory('Underscore', UnderscoreFactory)
;

function UnderscoreFactory($window) {
	return $window._;
}