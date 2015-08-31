'use strict';

module.exports = {
    name: 'sound',
    description: 'Czy na stronie uruchamia sie automatycznie dzwiek ?',
    run: function (page, callback) {
        page.evaluate(function () {
            if (document.querySelectorAll('audio[autoplay]').length) {
                return 'audio';
            } else if (document.querySelectorAll('bgsound[src]').length) {
                return 'bgsound';
            }
            return '';
        }, function (soundTag) {
            callback({
                score: 100 * (soundTag === ''),
                tag: soundTag
            });
        });
    }
};