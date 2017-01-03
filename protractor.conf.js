var webdriver = require('chromedriver'),
    config = require('./gulp.config');

exports.config = {
    framework: 'jasmine',
    directConnect: true,
  	baseUrl: 'http://localhost:3000',
  	chromeDriver: webdriver.path,
  	capabilities: {
        'browserName': 'chrome'
    },

    // Spec patterns are relative to the configuration file location passed
    // to protractor (in this example conf.js).
    // They may include glob patterns.
    specs: [
        config.root + '/src/**/*.test.js',
        config.root + '/../Components/**/*.test.js'
    ],

    suites: {
        all: [
            config.root + '/src/**/*.test.js',
            config.root + '/../Components/**/*.test.js'
        ]
    }
};