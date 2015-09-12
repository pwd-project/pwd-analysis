'use strict';

module.exports = {
    name: 'sound',
    run: function (page, callback) {
        return page.evaluate(function () {
            var soundTag;
            if (document.querySelectorAll('audio[autoplay]').length) {
                soundTag = 'audio';
            } else if (document.querySelectorAll('bgsound[src]').length) {
                soundTag = 'bgsound';
            } else {
                soundTag = '';
            }
            return {
                score: 100 * (soundTag === ''),
                tag: soundTag
            };
        }, callback);
    }
};