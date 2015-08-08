'use strict';

module.exports = {
    name: 'htmlLang',
    description: 'Czy tag html ma ustawiony język',
    run: function (page, callback) {
        page.evaluate(function () {
            return document.querySelector('html').getAttribute('lang');
        }, function (lang) {
            callback({
                score: 100 * (lang !== ''),
                language: lang
            });
        });
    }
};