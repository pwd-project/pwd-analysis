'use strict';

module.exports = {
    name: 'bigFont',
    description: 'Czy na stronie jest mozliwa zmiana rozmiaru czcionki?',
    run: function (page, callback) {
        page.evaluate(function () {
            return document.querySelector('a[title*="cionka du"]').getAttribute('href');
        }, function (href) {
            callback({
                score: 100 * (href !== '') * (href !== null),
                href: href
            });
        });
    }
};