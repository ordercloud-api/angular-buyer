function BasePage() {
    this.get = function() {
<<<<<<< HEAD
        browser.get('/#');
=======
        browser.get('#');
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
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
<<<<<<< HEAD
            expect(page.getTitle()).toBe('OrderCloud');
=======
            expect(page.getTitle()).toBe('Angular Buyer');
>>>>>>> 281bb9e29d0e44c929457c755c5b59714e368ee2
        });
    })
});