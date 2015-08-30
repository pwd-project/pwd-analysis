'use strict';

module.exports = {
    name: 'headerContent',
    description: 'Czy na stronie są nagłówki bez treści?',
    run: function (page, callback) {
        page.evaluate(function () {
            var headerTags = 'h1,h2,h3,h4,h5,h6';
            var allHeaders = document.querySelectorAll(headerTags);
            var headerCount = allHeaders.length;

            //there's only <h1> tag and it should be first
            var h1Count = document.querySelectorAll('h1').length;

            var isH1First = (document.querySelector(headerTags).nodeName === 'H1');


            //all <h*> should be non-empty
            var emptyHeadersCount = document.querySelectorAll('h1:empty,h2:empty,h3:empty,h4:empty,h5:empty,h6:empty').length;

            //all <h*> tags should not contain children nodes - only text node
            var headerWithChildrenCount = 0;

            for(var i = 0;i<headerCount;++i){
                var header = allHeaders[i];

                if( header.children.length > 0 ) {
                    ++headerWithChildrenCount;
                }
            }

            var score = 100;

            if( headerCount > 0 ){
                if( h1Count !== 1 || !isH1First ) {
                    score = 0;
                }
                else {
                    score -= Math.round(40 * emptyHeadersCount/headerCount);
                    score -= Math.round(40 * headerWithChildrenCount/headerCount);
                }
            }

            return [headerCount, h1Count, isH1First, emptyHeadersCount, headerWithChildrenCount, score];
        }, function (headers) {
            callback({
                allHeaders: headers[0],
                h1Count: headers[1],
                isH1First: headers[2],
                emptyHeaders: headers[3],
                headerWithChildren: headers[4],
                score: headers[5]
            });
        });
    }
};