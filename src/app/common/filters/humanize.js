angular.module('orderCloud')
    .filter('humanize', humanize)
;

function humanize() {
    return function(string) {
        if (!string) return;

        return string
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str){ return str.toUpperCase(); })
            .trim();
    }
}