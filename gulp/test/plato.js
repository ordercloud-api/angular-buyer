var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    config = require('../../gulp.config'),
    plato = require('plato');

gulp.task('report', function(done) {
    generateReport(done);
});

gulp.task('plato', ['report'], function() {
    return openReport();
});

function generateReport(done) {
    var files = [
        config.build + '**/*.js',
        '!' + config.build + '**/*.test.js',
        '!' + config.build + '**/*.spec.js'
    ];

    var outputDir = './plato/dir';
    var options = {
        title: 'OrderCloud Code Analysis'
    };

    var callback = function(report) {
        plato.getOverviewReport(report);
        if (done) {
            done();
        }
    };

    plato.inspect(files, outputDir, options, callback);
}

function openReport() {
    browserSync.init({
        logLevel: 'silent',
        notify: false,
        open: true,
        port: 453,
        files: [
            './plato/dir/files/**/*'
        ],
        server: {
            index: 'index.html',
            baseDir: [
                './plato/dir/'
            ]
        },
        ui: false
    });
}

module.exports = {
    GenerateReport: generateReport,
    OpenReport: openReport
};
