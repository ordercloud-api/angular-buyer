angular.module('orderCloud')
    .filter('ocCachedList', ocCachedList)
;

function ocCachedList() {
    return function(items, page) {
        if (!items || !page) return;

        var results = [];
        angular.forEach(items, function(item) {
            if (item.MetaPage && item.MetaPage == page) {
                results.push(item);
            }
        });

        return results;
    }
}