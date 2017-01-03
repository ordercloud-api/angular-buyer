var jar = require('selenium-server-standalone-jar'),
    config = require('./gulp.config');

exports.config = {
    framework: 'jasmine',
	seleniumServerJar: jar.path,
  	specs: ['./src/**/*.test.js'],
  	baseUrl: 'http://localhost:3000',
  	chromeDriver: './node_modules/chromedriver/lib/chromedriver/chromedriver.exe',
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