'use strict';

module.exports = {
    name: 'bigFont',
    run: function (page, callback) {
        return page.evaluate(function () {
            var href = document.querySelector('a[title*="cionka du"],a[title*="ksza wielko"],a[title*="kszy rozmiar"],a[id="fontInc"],a[id="inc_font"],a[onClick*="FontSize"],a[class="big-font"]');
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
