'use strict';

module.exports = {
    name: 'headerContent',
    run: (page) => {
        return page.evaluate(function () {
            var allHeaders = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
            if (allHeaders.length === 0) {
                return {score: 100};
            }
            var headers = {
                allHeaders: allHeaders,
                h1Count: document.querySelectorAll('h1').length,
                isH1First: allHeaders[0].nodeName === 'H1',
                emptyHeadersCount: Math.min(document.querySelectorAll('h1:empty,h2:empty,h3:empty,h4:empty,h5:empty,h6:empty').length, allHeaders.length),
                headerWithChildrenCount: Math.min(document.querySelectorAll('h1>*,h2>*,h3>*,h4>*').length, allHeaders.length)
            };
            var headerCount = headers.allHeaders.length;
            var score = 100;
            if (headerCount > 0) {
                if (headers.h1Count !== 1 || !headers.isH1First) {
                    score = 0;
                }
                else {
                    score -= Math.round(40 * headers.emptyHeadersCount / headerCount);
                    score -= Math.round(40 * headers.headerWithChildrenCount / headerCount);
                }
            }

            return {
                allHeaders: headers.allHeaders.length,
                h1Count: headers.h1Count,
                isH1First: headers.isH1First,
                emptyHeaders: headers.emptyHeadersCount,
                headerWithChildren: headers.headerWithChildrenCount,
                score: score
            };
        });
    }
};