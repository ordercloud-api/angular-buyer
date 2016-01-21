function BasePage() {
    this.get = function() {
        browser.get('/#');
    };

    this.getTitle = function() {
        return browser.getTitle();
    };
}

describe('Base', function() {
    var page = new BasePage();

    beforeEach(function() {
        page.get();
    });

    describe('base', function() {
        it ("should display the correct title", function() {
            expect(page.getTitle()).toBe('OrderCloud');
        });
    })
});