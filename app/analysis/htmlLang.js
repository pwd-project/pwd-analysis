'use strict';

module.exports = {
    name: 'htmlLang',
    run: function (page) {
        return page.evaluate(function () {
            var lang = document.querySelector('html').getAttribute('lang');
            return {
                score: 100 * (lang !== ''),
                language: lang
            };
        });
    }
};