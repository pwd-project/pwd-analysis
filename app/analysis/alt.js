'use strict';

module.exports = {
    name: 'alt',
    run: function (page, callback) {
        return page.evaluate(function () {
            var allImages = document.querySelectorAll('img').length;
            var withoutAlt = document.querySelectorAll('img:not([alt])').length;
            var withImproperAlt = document.querySelectorAll('img[alt=" "]').length+document.querySelectorAll('img[alt="-"]').length+document.querySelectorAll('img[alt="*"]').length;
            var withHTMLAlt = document.querySelectorAll('img[alt*="<"]').length;
            return {
                images: allImages,
                withoutAlt: withImproperAlt + withoutAlt + withHTMLAlt,
                score: (allImages === 0)?100:(100 - Math.round(100 * (withImproperAlt + withoutAlt + withHTMLAlt) / allImages))
            };
        }, callback);
    }
};