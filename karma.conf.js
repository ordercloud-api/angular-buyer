// Karma configuration
// Generated on Mon Oct 03 2016 09:44:56 GMT-0500 (Central Daylight Time)

module.exports = function(config) {
  var mainBowerFiles = require('main-bower-files');
  var path = require('path');

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: __dirname,


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [].concat(
      mainBowerFiles({filter: '**/*.js'}),
      'bower_components/angular-mocks/angular-mocks.js',
      'src/global.spec.js',
      'build/**/app.module.js',
      'build/**/app.*.js',
      'build/**/*.js',
      'src/**/*.spec.js',
      '../Components/**/*.spec.js',
      'src/app/**/*.html',
      '../Components/**/*.html'
    ),

    // list of files to exclude
    exclude: [
      'build/**/*.test.js',
      '../Components/**/*.test.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        '**/*.html': ['ng-html2js'],
        '../Components/**/*.html': ['ng-html2js']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    ngHtml2JsPreprocessor: {
        //stripPrefix: 'src/app/',
        cacheIdFromPath: function(filepath) {
          filepath = filepath.replace('src/app', '');
          filepath = filepath.replace((path.join(__dirname, '../Components/').replace(/\\/g, '/')), '');
          return filepath;
        },
        moduleName: 'orderCloud'
    }
  });
};