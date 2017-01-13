var gulp = require('gulp'),
    config = require('../../gulp.config'),
    Server = require('karma').Server;

gulp.task('test:unit', ['scripts', 'app-config'], function(done) {
    new Server({
        configFile: config.root + '/karma.conf.js',
        singleRun: true
    }, done).start();
});