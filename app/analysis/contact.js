'use strict';

module.exports = {
    name: 'htmlLang',
    description: 'Czy na stronie jest odnosnik do strony z informacją kontaktowa ?',
    run: function (page, callback) {
        page.evaluate(function () {
            allHypers = document.querySelectorAll('a');
            var i;
            var href = '';
            for (i = 0; i < allHypers.length; i++) {
              if ((allHypers[i] === 'Kontakt') && (allHypers[i].href !== ''))
                href = allHypers[i].href;
            }
            return score;
        }, function (href) {
            callback({
                score: 100 * (href !== ''),
                address: href
            });
        });
    }
};