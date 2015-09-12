'use strict';

module.exports = {
    name: 'bigFont',
    run: function (page, callback) {
        page.evaluate(function () {
            var href = document.querySelector('a[title*="cionka du"]').getAttribute('href');
            return {
                score: 100 * (href !== '') * (href !== null),
                href: href
            };
        }, callback);
    }
};