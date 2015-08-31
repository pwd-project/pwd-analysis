'use strict';

module.exports = {
    name: 'contact',
    description: 'Czy na stronie jest odnosnik do strony z informacją kontaktowa ?',
    run: function (page, callback) {
        page.evaluate(function () {
            var allHyperlinks = document.querySelectorAll('a:not([href=""])');
            for (var i = 0; i < allHyperlinks.length; i++) {
                if (allHyperlinks[i].innerText.toLowerCase().indexOf('kontakt') >= 0) {
                    return allHyperlinks[i].href;
                }
            }
            return '';
        }, function (href) {
            callback({
                score: 100 * (href !== ''),
                address: href
            });
        });
    }
};