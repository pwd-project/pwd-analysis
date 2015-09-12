'use strict';

module.exports = {
    name: 'bigFont',
    run: function (page, callback) {
        return page.evaluate(function () {
            var href = document.querySelector('a[title*="cionka du"]');
            if (href !== null) {
                href = href.getAttribute('href');
            }
            return {
                score: 100 * (href !== '') * (href !== null),
                href: href
            };
        }, callback);
    }
};