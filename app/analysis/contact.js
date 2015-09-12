'use strict';

module.exports = {
    name: 'contact',
    run: function (page, callback) {
        return page.evaluate(function () {
            var allHyperlinks = document.querySelectorAll('a:not([href=""])');
            var href = getFirstContactLink();

            function getFirstContactLink() {
                for (var i = 0; i < allHyperlinks.length; i++) {
                    if (allHyperlinks[i].innerText.toLowerCase().indexOf('kontakt') >= 0) {
                        return allHyperlinks[i].href;
                    }
                }
                return '';
            }

            return {
                score: 100 * (href !== ''),
                address: href
            };
        }, callback);
    }
};