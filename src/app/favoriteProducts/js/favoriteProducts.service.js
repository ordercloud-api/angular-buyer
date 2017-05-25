angular.module('orderCloud')
    .factory('ocFavoriteProducts', OrderCloudFavoriteProductsService)
;

function OrderCloudFavoriteProductsService($q, $timeout, OrderCloudSDK) {
    var service = {
        Init: _init,
        Toggle: _toggle,
        Get: _get
    };

    var favoriteProducts,
        updating = false,
        initializing = false;

    function _init(productID) {
        var df = $q.defer();

        function _initLoop() {
            if (!favoriteProducts && !initializing) {
                initializing = true;
                OrderCloudSDK.Me.Get()
                    .then(function(data) {
                        if (data.xp && data.xp.FavoriteProducts && data.xp.FavoriteProducts) {
                            favoriteProducts = data.xp.FavoriteProducts;
                        } else {
                            favoriteProducts = [];
                        }
                        initializing = false;
                        _completeLoop();
                    });
            } else if (initializing) {
                $timeout(function() {
                    _initLoop();
                }, 100);
            } else if (favoriteProducts) {
                _completeLoop();
            }
        }

        function _completeLoop() {
            if (productID) {
                df.resolve(favoriteProducts.indexOf(productID) > -1);
            } else {
                df.resolve(favoriteProducts);
            }
        }

        _initLoop();

        return df.promise;
    }

    function _toggle(productID) {
        var df = $q.defer();

        function _toggleLoop() {
            if (!updating) {
                updating = true;
                var newFavorites = angular.copy(favoriteProducts),
                    added;

                if (favoriteProducts.indexOf(productID) > -1) {
                    newFavorites = _.without(favoriteProducts, productID);
                    added = false;
                } else {
                    newFavorites.push(productID);
                    added = true;
                }

                OrderCloudSDK.Me.Patch({xp: {FavoriteProducts: newFavorites}})
                    .then(function() {
                        favoriteProducts = newFavorites;

                        updating = false;
                        df.resolve(added);
                    })
                    .catch(function() {
                        df.reject('You do not have permission to favorite products.');
                    });

            } else {
                $timeout(function() {
                    _toggleLoop();
                }, 100);
            }
        }
        _toggleLoop();

        return df.promise;
    }

    function _get() {
        if (!favoriteProducts) {
            return _init();
        } else {
            var df = $q.defer();
            df.resolve(favoriteProducts);
            return df.promise;
        }
    }

    return service;
}