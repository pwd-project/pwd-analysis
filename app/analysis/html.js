/* globals XMLHttpRequest */
'use strict';

module.exports = {
    name: 'html',
    run: function (page) {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://validator.w3.org/nu/?doc=' + page.url + '&out=json', false);
        request.send(null);
        if (request.status === 200) {
            var result = JSON.parse(request.responseText);
            var errors = result.messages.filter(function (message) {
                return message.type === 'error';
            });
            var warnings = result.messages.filter(function (message) {
                return message.type === 'warning';
            });
            return {'score': Math.max(0, 100 - (errors.length * 5 + warnings.length * 1))};
        } else {
            return {'score': 0};
        }
    }
};