var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del'),
    inject = require('gulp-inject'),
    mainBowerFiles = require('main-bower-files'),
    replace = require('gulp-replace-task');

gulp.task('clean:inject', function() {
    return del(config.build + '*.html');
});

gulp.task('inject', ['clean:inject', 'scripts', 'assets', 'app-config', 'bower-fonts', 'styles'], function() {
    var target = gulp.src(config.index),
        bowerFiles = gulp.src(mainBowerFiles({
            filter: ['**/*.js', '**/angular-toastr.css', '**/angular-ui-tree.css', '**/tree-control.css', '**/angular-busy.css']
        }), {read: false}),
        appFiles = gulp.src([].concat(config.appFiles), {read: false});

    return target
        .pipe(inject(bowerFiles, {
            name: 'bower',
            ignorePath: config.bowerFiles.replace('.', ''),
            addPrefix: 'bower_files'
        }))
        .pipe(inject(appFiles, {
            ignorePath: config.build.replace('.', '')
        }))
        .pipe(replace({
            patterns: [
                {
                    match:'appModule',
                    replacement: config.saas.moduleName || config.moduleName
                },
                {
                    match:'conditionalStylesRef',
                    replacement: config.saas.moduleName ? '<link rel="stylesheet" type="text/css" href="assets/styles/styles.css">' : ''
                }
            ]
        }))
        .pipe(gulp.dest(config.build));
});
