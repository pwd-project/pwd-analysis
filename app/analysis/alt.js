'use strict';

module.exports = {
    name: 'alt',
    description: 'Czy na stronie są obrazki bez alt',
    run: function (page, callback) {
        page.evaluate(function () {
            return [document.querySelectorAll('img').length, document.querySelectorAll('img:not([alt])').length];
        }, function (images) {
            callback({
                images: images[0],
                withoutAlt: images[1],
                score: 100 - (images[0] / images[1])
            });
        });
    }
};