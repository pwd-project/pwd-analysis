'use strict';

module.exports = {
    name: 'alt',
    description: 'Czy na stronie są obrazki bez alt?',
    run: function (page, callback) {
        page.evaluate(function () {
            var allImages = document.querySelectorAll('img').length;
            var withoutAlt = document.querySelectorAll('img:not([alt])').length;
            var withEmptyAlt = document.querySelectorAll('img[alt=""]').length;
            return [allImages, withoutAlt + withEmptyAlt];
        }, function (images) {
            callback({
                images: images[0],
                withoutAlt: images[1],
                score: 100 - Math.round(100 * images[1] / images[0])
            });
        });
    }
};