/* This test will have to be run first so the user is logged in */
function LoginPage() {
    this.get = function() {
        browser.get('#/login');
    };
}

describe('login page', function() {
    var page = new LoginPage();

    beforeEach(function() {
        page.get();
    });

    describe('forgot password', function() {

    });

    describe('login', function() {

    });
});