(function () {
    'use strict';

    var nodemon = require('gulp-nodemon'),
        gulp = require('gulp'),
        config = require('../gulp.config'),
        styles = require('./build/styles'),
        cache = require('gulp-cached'),
        browserSync = require('browser-sync').create('oc-server'),
        port = process.env.PORT || 7205;

    function startBrowerSync () {
        if (browserSync.active) {
            return;
        }

        browserSync.init({
            proxy: 'localhost:' + port,
            port: 3000,
            ghostMode: {
                clicks: true,
                forms: true,
                scroll: true
            },
            injectChanges: true,
            logFileChanges: true,
            logPrefix: 'OrderCloud-Components'
        });
    }

    module.exports = function (isDev) {
        if (isDev) {
            gulp.watch([].concat(
                config.src + '**/*.html'
            ))
                .on('change', browserSync.reload);
            gulp.watch([].concat(
                config.scripts
            ), ['scripts-watch']);
            gulp.watch([].concat(
                config.styles
            ), ['styles']);
            gulp.watch(config.src + '**/app.constants.json', ['app-config'])
                .on('change', function() {
                    styles();
                    return browserSync.reload;
                });
        }
        return nodemon ({
            script: './server.js',
            delayTime: 1,
            env: {
                'PORT': port,
                'NODE_ENV': isDev ? 'dev' : 'production'
            },
            watch: ['./server.js']
        })
            .on('start', function () {
                console.log('*** NODEMON STARTED ***');
                startBrowerSync();
            })
            .on('restart', ['vet'], function (env) {
                console.log('*** NODEMON RESTARTED ***');
                console.log('*** FILES CHANGED ON RESTART: ***\n' + env);
                console.log('FILES CHANGED:\n' + env);
                setTimeout(function () {
                    browserSync.notify('*** RELOADING NOW ***');
                    browserSync.reload({ stream: false });
                }, 1000);
            })
            .on('crash', function () {
                delete cache.caches['jsscripts'];
                console.log('*** NODEMON CRASHED ***');
            })
            .on('exit', function () {
                delete cache.caches['jsscripts'];
                console.log('*** NODEMON EXITED ***');
            });
    };

}());
