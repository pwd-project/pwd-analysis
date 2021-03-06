'use strict';

module.exports = {
    name: 'formattingTags',
    run: (page) => {
        return page.evaluate(function () {
            var allTags = document.querySelectorAll('body *').length;
            var formattingTags = document.querySelectorAll('abbr,acronym,address,b,basefont,bdi,bdo,big,blockquote,br,center,cite,code,del,details,dfn,dialog,em,figcaption,font,hr,i,ins,kbd,mark,meter,pre,q,rt,s,samp,small,strike,strong,sub,sup,time,u,wbr,body *[align]').length;
            return {
                allTags: allTags,
                formattingTags: formattingTags,
                score: 100 - Math.round(100 * formattingTags / allTags) || 0
            };
        });
    }
};