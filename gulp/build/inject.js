var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del'),
    inject = require('gulp-inject'),
    mainBowerFiles = require('main-bower-files');

gulp.task('clean:inject', function() {
    return del(config.build + '*.html');
});

gulp.task('inject', ['clean:inject', 'scripts', 'assets', 'app-config', 'bower-fonts', 'styles'], function() {
    var target = gulp.src(config.index),
        bowerFiles = gulp.src(mainBowerFiles({filter: ['**/*.js', '**/*.css']}), {read: false}),
        appFiles = gulp.src([].concat(config.appFiles), {read: false});

    return target
        .pipe(inject(bowerFiles, {name: 'bower', ignorePath: config.bowerFiles.replace('.', ''), addPrefix: 'bower_files'}))
        .pipe(inject(appFiles, {ignorePath: config.build.replace('.', '')}))
        .pipe(gulp.dest(config.build));
});
