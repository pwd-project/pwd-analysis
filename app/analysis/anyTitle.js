'use strict';

module.exports = {
    name: 'anyTitle',
    run: (page) => {
        return page.evaluate(function () {
            var title = document.title;
            return {
                score: 100 * (title !== ''),
                title: title
            };
        });
    }
};