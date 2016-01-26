'use strict';

module.exports = {
    name: 'bigFont',
    run: function (page, callback) {
        return page.evaluate(function () {
            var elem = document.querySelector('a[title*="cionka du"],a[title*="ksza wielko"],a[title*="ksz wielko"],a[id="fontInc"],a[id="inc_font"],a[onClick*="FontSize"],a[class="big-font"],a[class*="resize"],span[title*="ksz tekst"]');
            var href = elem;
            if (href !== null) {
                href = elem.getAttribute('href');
                if (href === null) {
                    href = elem.getAttribute('class');
                }
            }
            return {
                score: 100 * (href !== '') * (href !== null),
                href: href
            };
        }, callback);
    }
};