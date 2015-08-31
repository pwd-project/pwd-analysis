'use strict';

module.exports = {
    name: 'headerContent',
    description: 'Czy na stronie są nagłówki bez treści?',
    run: function (page, callback) {
        page.evaluate(function () {
            var allHeaders = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
            return {
                allHeaders: allHeaders,
                h1Count: document.querySelectorAll('h1').length,
                isH1First: allHeaders[0].nodeName === 'H1',
                emptyHeadersCount: document.querySelectorAll('h1:empty,h2:empty,h3:empty,h4:empty,h5:empty,h6:empty').length,
                headerWithChildrenCount: document.querySelectorAll('h1>*,h2>*,h3>*,h4>*,h5>*,h6>*').length
            };
        }, function (headers) {
            var headerCount = headers.allHeaders.length;
            var headerWithChildrenCount = 0;
            var score = 100;
            if (headerCount > 0) {
                if (headers.h1Count !== 1 || !headers.isH1First) {
                    score = 0;
                }
                else {
                    score -= Math.round(40 * headers.emptyHeadersCount / headerCount);
                    score -= Math.round(40 * headerWithChildrenCount / headerCount);
                }
            }
            callback({
                allHeaders: headers.allHeaders.length,
                h1Count: headers.h1Count,
                isH1First: headers.isH1First,
                emptyHeaders: headers.emptyHeadersCount,
                headerWithChildren: headers.headerWithChildrenCount,
                score: score
            });
        });
    }
};