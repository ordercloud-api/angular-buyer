var gulp = require('gulp');
var browserSync = require('browser-sync').create();

//Enter Server Info Here
var appName = null;  //used for externally accessible site... must only include letters ('_', '-' not allowed)
var portNumber = 12000;  //used for localhost



if (appName) {
    appName = appName.toLowerCase();
}
if (portNumber) {
    if (isNaN(portNumber)) {
        portNumber = null;
        console.log('portNumber must be numeric');
    }
    if (portNumber < 10000 || portNumber > 65536) {
        portNumber = null;
    }
}

gulp.task('testServe', function() {
    browserSync.init({
        server: {
            baseDir: config.build,
            index: 'index.html',
            routes: ''
        },
        port: (portNumber || 8000),
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        },
        logPrefix: 'OrderCloud 3.0',
        tunnel: 'ordercloudapp' + (appName || '')
    })
});