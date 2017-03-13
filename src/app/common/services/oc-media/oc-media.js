angular.module('orderCloud')
	.factory('$ocMedia', ocMediaFactory)
	.constant('MEDIA', MEDIA_CONSTANT)
	.constant('MEDIA_PRIORITY', MEDIA_PRIORITY_CONSTANT)
;

function MEDIA_CONSTANT() {
	return {
		'sm': '(max-width: 600px)',
		'gt-sm': '(min-width: 600px)',
		'md': '(min-width: 600px) and (max-width: 960px)',
		'gt-md': '(min-width: 960px)',
		'lg': '(min-width: 960px) and (max-width: 1200px)',
		'gt-lg': '(min-width: 1200px)'
	}
}

function MEDIA_PRIORITY_CONSTANT() {
	return [
		'gt-lg',
		'lg',
		'gt-md',
		'md',
		'gt-sm',
		'sm'
	];
}

function ocMediaFactory(MEDIA, MEDIA_PRIORITY, $rootScope, $window) {
	var queries = {};
	var mqls = {};
	var results = {};
	var normalizeCache = {};

	$ocMedia.getResponsiveAttribute = getResponsiveAttribute;
	$ocMedia.getQuery = getQuery;
	$ocMedia.watchResponsiveAttributes = watchResponsiveAttributes;

	return $ocMedia;

	function $ocMedia(query) {
		var validated = queries[query];
		if (angular.isUndefined(validated)) {
			validated = queries[query] = validate(query);
		}

		var result = results[validated];
		if (angular.isUndefined(result)) {
			result = add(validated);
		}

		return result;
	}

	function validate(query) {
		return MEDIA[query] ||
			((query.charAt(0) !== '(') ? ('(' + query + ')') : query);
	}

	function add(query) {
		var result = mqls[query] = $window.matchMedia(query);
		result.addListener(onQueryChange);
		return (results[result.media] = !!result.matches);
	}

	function onQueryChange(query) {
		$rootScope.$evalAsync(function() {
			results[query.media] = !!query.matches;
		});
	}

	function getQuery(name) {
		return mqls[name];
	}

	function getResponsiveAttribute(attrs, attrName) {
		for (var i = 0; i < MEDIA_PRIORITY.length; i++) {
			var mediaName = MEDIA_PRIORITY[i];
			if (!mqls[queries[mediaName]].matches) {
				continue;
			}

			var normalizedName = getNormalizedName(attrs, attrName + '-' + mediaName);
			if (attrs[normalizedName]) {
				return attrs[normalizedName];
			}
		}

		// fallback on unprefixed
		return attrs[getNormalizedName(attrs, attrName)];
	}

	function watchResponsiveAttributes(attrNames, attrs, watchFn) {
		var unwatchFns = [];
		attrNames.forEach(function(attrName) {
			var normalizedName = getNormalizedName(attrs, attrName);
			if (attrs[normalizedName]) {
				unwatchFns.push(
					attrs.$observe(normalizedName, angular.bind(void 0, watchFn, null)));
			}

			for (var mediaName in MEDIA) {
				normalizedName = getNormalizedName(attrs, attrName + '-' + mediaName);
				if (!attrs[normalizedName]) {
					return;
				}

				unwatchFns.push(attrs.$observe(normalizedName, angular.bind(void 0, watchFn, mediaName)));
			}
		});

		return function unwatch() {
			unwatchFns.forEach(function(fn) { fn(); })
		};
	}

	// Improves performance dramatically
	function getNormalizedName(attrs, attrName) {
		return normalizeCache[attrName] ||
			(normalizeCache[attrName] = attrs.$normalize(attrName));
	}
}
