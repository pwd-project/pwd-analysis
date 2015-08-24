'use strict';

module.exports = {
    name: 'headerContent',
    description: 'Czy na stronie są nagłówki bez treści?',
    run: function (page, callback) {
        page.evaluate(function () {
            var allHeaders = document.querySelectorAll('h1,h2,h3,h4,h5,h6').length;
            var withoutContent = document.querySelectorAll('h1:empty,h2:empty,h3:empty,h4:empty,h5:empty,h6:empty').length;
            return [allHeaders, withoutContent];
        }, function (headers) {
            callback({
                headers: headers[0],
                withoutContent: headers[1],
                score: 100 - Math.round(100 * headers[1] / headers[0])
            });
        });
    }
};