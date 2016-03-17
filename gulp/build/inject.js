var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del'),
    inject = require('gulp-inject'),
    mainBowerFiles = require('main-bower-files');

gulp.task('clean:inject', function() {
    return del(config.build + '*.html');
});

gulp.task('inject', ['clean:inject', 'scripts', 'styles'], function() {
    var target = gulp.src(config.index),
        bowerFiles = gulp.src(mainBowerFiles({filter: ['**/*.js', '**/*.css']}), {read: false}),
        appFiles = gulp.src(config.appFiles, {read: false});

    return target
        .pipe(inject(bowerFiles, {name: 'bower'}))
        .pipe(inject(appFiles))
        .pipe(gulp.dest(config.build));
});
