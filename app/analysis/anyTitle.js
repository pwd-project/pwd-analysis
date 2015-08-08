'use strict';

module.exports = {
    name: 'anyTitle',
    description: 'Czy na stronie jest title?',
    run: function (page, callback) {
        page.evaluate(function () {
            return document.title;
        }, function (title) {
            callback({
                score: 100 * (title !== ''),
                title: title
            });
        });
    }
};