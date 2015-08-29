'use strict';

module.exports = {
    name: 'headerContent',
    description: 'Czy na stronie są nagłówki bez treści?',
    run: function (page, callback) {
        page.evaluate(function () {
            var headerTags = 'h1,h2,h3,h4,h5,h6,H1,H2,H3,H4,H5,H6';
            var allHeaders = document.querySelectorAll(headerTags);
            var headerCount = allHeaders.length;

            //there's only <h1> tag and it should be first
            var h1Count = document.querySelectorAll('h1,H1').length;

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

            //all <h*> should not be sibling
            //we count quotinet of number of <h*> tags sibling to other <h*> tag and
            //total count of <h*> tags
            var siblingHeadersCount = 0;

            var previous_was_header = false;
            var current_is_header = false;

            var allElements = document.getElementsByTagName('*');

            for(i = 0; i<allElements.length; ++i){
                var element = allElements[i];
                if( element) {
                    current_is_header = ( headerTags.indexOf(element.nodeName) > -1 );

                    if( current_is_header && previous_was_header ){
                        ++siblingHeadersCount;
                    }
                    previous_was_header = current_is_header;
                }
                else {
                    previous_was_header = false;
                }

                element = element.nextSibling;
            }

            //if the last element is header than it's we add one to siblingHeadersCount
            if( current_is_header ) {
                ++siblingHeadersCount;
            }

            var score = 100;

            if( headerCount > 0 ){
                if( h1Count !== 1 || !isH1First ) {
                    score = 0;
                }
                else {
                    score -= Math.round(25 * emptyHeadersCount/headerCount);
                    score -= Math.round(25 * siblingHeadersCount/headerCount);
                    score -= Math.round(25 * headerWithChildrenCount/headerCount);
                }
            }

            return [headerCount, h1Count, isH1First, emptyHeadersCount, siblingHeadersCount, headerWithChildrenCount, score];
        }, function (headers) {
            callback({
                allHeaders: headers[0],
                h1Count: headers[1],
                isH1First: headers[2],
                emptyHeaders: headers[3],
                siblingHeaders: headers[4],
                headerWithChildren: headers[5],
                score: headers[6]
            });
        });
    }
};