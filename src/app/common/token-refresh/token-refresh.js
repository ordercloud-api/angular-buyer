angular.module('orderCloud')
	.factory('TokenRefresh', TokenRefresh)
;

function TokenRefresh($resource, $cookieStore, ocscope, clientid) {
	var service = {
		Set: _set,
		Get: _get,
		SetToken: _setToken,
		GetToken: _getToken,
		Refresh: _refresh
	};
	var remember;

	return service;
	////

	function _set(value) {
		remember = value;
	}

	function _get() {
		return remember;
	}

	function _setToken(token) {
		$cookieStore.put(appname + '.refresh_token', token);
	}

	function _getToken() {
		$cookieStore.get(appname + '.refresh_token');
	}

	function _refresh(token) {
		var data = $.param({
			grant_type: 'refresh_token',
			scope: ocscope,
			client_id: clientid,
			refresh_token: token
		});
		return $resource(authurl, {}, { refresh: { method: 'POST'}}).refresh(data).$promise;
	}

}