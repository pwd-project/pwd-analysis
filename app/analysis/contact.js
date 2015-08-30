'use strict';

module.exports = {
    name: 'contact',
    description: 'Czy na stronie jest odnosnik do strony z informacją kontaktowa ?',
    run: function (page, callback) {
        page.evaluate(function () {
            var allHypers = document.querySelectorAll('a');
            var i;
            var hrefText = '';

            for (i = 0; i < allHypers.length; i++) {
              if (allHypers[i].innerText.toLowerCase().indexOf('kontakt') >=0 && allHypers[i].href !== '') {
                hrefText = allHypers[i].href;
                      }
            }
            return hrefText;
        }, function (href) {
            callback({
                score: 100 * (href !== ''),
                address: href
            });
        });
    }
};