angular.module('orderCloud')
    .directive('ocFavoriteOrder', ocFavoriteOrderDirective)
;

function ocFavoriteOrderDirective($exceptionHandler, OrderCloudSDK, toastr) {
    return {
        scope: {
            currentUser: '<',       //required - the currently authenticated user
            ocFavoriteOrder: '<',   //required - order to be favorited
            favoriteClass: '@',     //required - a space delimited list of classes to use if order is favorited
            nonFavoriteClass: '@'   //required - a space delimited list of classes to use if order is NOT favorited
        },
        restrict: 'A',
        link: function(scope, element){
            if(typeof scope.currentUser === 'undefined' || typeof scope.ocFavoriteOrder === 'undefined' || typeof scope.favoriteClass === 'undefined' || typeof scope.nonFavoriteClass === 'undefined'){
                $exceptionHandler({message: 'ocFavoriteOrder directive is not configured correctly, missing current user or order'});
            }
            scope.hasFavorites = !!scope.currentUser && !!scope.currentUser && !!scope.currentUser.xp.FavoriteOrders;
            scope.isFavorited = !!scope.hasFavorites && scope.currentUser.xp.FavoriteOrders.indexOf(scope.ocFavoriteOrder.ID) > -1;
            scope.isFavorited ? element.addClass(scope.favoriteClass) : element.addClass(scope.nonFavoriteClass);

            element.on('click', function(){
                if (scope.hasFavorites && scope.isFavorited){
                    removeOrder();
                } else if (scope.hasFavorites && !scope.isFavorited) {
                    addOrder(scope.currentUser.xp.FavoriteOrders);
                } else {
                    addOrder([]);
                }
            });

            scope.$on('$destroy', function(){
                //prevent memory leak
                element.off('click');
            });

            function addOrder(existingList) {
                existingList.push(scope.ocFavoriteOrder.ID);
                return OrderCloudSDK.Me.Patch({xp: {FavoriteOrders: existingList}})
                    .then(function(user){
                        scope.isFavorited = true;
                        element.toggleClass(scope.favoriteClass + ' ' + scope.nonFavoriteClass);
                        scope.currentUser.xp.FavoriteOrders = user.xp.FavoriteOrders;
                        toastr.success('Saved to your favorite orders', 'Success');
                    });
            }

            function removeOrder(){
                var updatedList = _.without(scope.currentUser.xp.FavoriteOrders, scope.ocFavoriteOrder.ID);
                return OrderCloudSDK.Me.Patch({xp: {FavoriteOrders: updatedList}})
                    .then(function(){
                        scope.isFavorited = false;
                        element.toggleClass(scope.favoriteClass + ' ' + scope.nonFavoriteClass);
                        scope.currentUser.xp.FavoriteOrders = updatedList;
                        toastr.success('Removed from your favorite orders', 'Success');
                    });
            }
        }
    };
}