// An example configuration file
exports.config = {
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        browserName: 'chrome'
    },

    // Spec patterns are relative to the configuration file location passed
    // to protractor (in this example conf.js).
    // They may include glob patterns.
    specs: ['./src/**/*.test.js'],

    suites: {
        all: './src/**/*.test.js',
        buyer: [
            './src/cart/**/*.test.js',
            './src/catalog/**/*.test.js',
            './src/checkout/**/*.test.js',
            './src/orderHistory/**/*.test.js'
        ],
        admin: [
            './src/addresses/**/*.test.js',
            './src/adminUsers/**/*.test.js',
            './src/approvalRules/**/*.test.js',
            './src/buyers/**/*.test.js',
            './src/categories/**/*.test.js',
            './src/costCenters/**/*.test.js',
            './src/coupons/**/*.test.js',
            './src/creditCards/**/*.test.js',
            './src/giftCards/**/*.test.js',
            './src/orders/**/*.test.js',
            './src/priceSchedules/**/*.test.js',
            './src/products/**/*.test.js',
            './src/shipments/**/*.test.js',
            './src/specs/**/*.test.js',
            './src/spendingAccounts/**/*.test.js',
            './src/userGroups/**/*.test.js',
            './src/users/**/*.test.js'
        ],
        common: [
            './src/common/**/*.test.js',
            './src/account/**/*.test.js',
            './src/base/**/*.test.js',
            './src/home/**/*.test.js',
            './src/login/**/*.test.js'
        ]
    },

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true // Use colors in the command line report.
    }
};