'use strict';

module.exports = {
    name: 'sound',
    description: 'Czy na stronie uruchamia sie automatycznie dzwiek ?',
    run: function (page, callback) {
        page.evaluate(function () {
            var allAudio;
            var soundTag = '';
            allAudio = document.querySelectorAll('audio[autoplay]');
            if (allAudio.length > 0) {
              soundTag = 'audio';
            }
            allAudio = document.querySelectorAll('bgsound[src]');
            if (allAudio.length > 0) {
              soundTag = 'bgsound';
            }
            return soundTag;
        }, function (soundTag) {
            callback({
                score: 100 * (soundTag === ''),
                tag: soundTag
            });
        });
    }
};