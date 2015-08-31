'use strict';

module.exports = {
    name: 'formattingTags',
    description: 'Czy na stronie są tylko tagi semantyczne?',
    run: function (page, callback) {
        page.evaluate(function () {
            var allTags = document.querySelectorAll('body *').length;
            var formattingTags = document.querySelectorAll('abbr,acronym,address,article,b,basefont,bdi,bdo,big,blockquote,br,center,cite,code,del,details,dfn,dialog,em,figcaption,figure,font,hr,i,ins,kbd,mark,meter,pre,q,rt,s,samp,small,strike,strong,sub,sup,time,u,wbr,body *[align]').length;
            return [allTags, formattingTags];
        }, function (tags) {
            callback({
                allTags: tags[0],
                formattingTags: tags[1],
                score: 100 - Math.round(100 * tags[1] / tags[0])
            });
        });
    }
};