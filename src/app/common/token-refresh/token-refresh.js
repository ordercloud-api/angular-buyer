angular.module('orderCloud')
	.factory('TokenRefresh', TokenRefresh)
;

function TokenRefresh($resource, $localForage, $injector, clientid, appname, authurl) {
	var service = {
		Set: _set,
		Get: _get,
		SetToken: _setToken,
		GetToken: _getToken,
		Refresh: _refresh,
		RemoveToken: _removeToken
	};
	var remember;
	var scope = $injector.has('scope') ? $injector.get('scope') : null;
	var ocscope = $injector.has('ocscope') ? $injector.get('ocscope') : null;

	return service;
	////

	function _set(value) {
		remember = value;
	}

	function _get() {
		return remember;
	}

	function _setToken(token) {
		return $localForage.setItem(appname + '.refresh_token', token);
	}

	function _getToken() {
		return $localForage.getItem(appname + '.refresh_token');
	}

	function _removeToken(){
		$localForage.removeItem(appname + '.refresh_token');
	}

	function _refresh(token) {
		var data = $.param({
			grant_type: 'refresh_token',
			scope: scope ? scope : ocscope,
			client_id: clientid,
			refresh_token: token
		});
		return $resource(authurl, {}, {refresh: {method: 'POST'}}).refresh(data).$promise;
	}

}