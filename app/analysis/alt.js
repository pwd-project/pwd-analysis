'use strict';

module.exports = {
    name: 'alt',
    run: function (page, callback) {
        return page.evaluate(function () {
            var allImages = document.querySelectorAll('img').length;
            var withoutAlt = document.querySelectorAll('img:not([alt])').length;
            var withEmptyAlt = document.querySelectorAll('img[alt=""]').length;
            return {
                images: allImages,
                withoutAlt: withEmptyAlt + withoutAlt,
                score: (allImages === 0)?100:(100 - Math.round(100 * (withEmptyAlt + withoutAlt) / allImages))
            };
        }, callback);
    }
};