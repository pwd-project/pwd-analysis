'use strict';

var w3cjs = require('w3cjs');

module.exports = {
    name: 'w3c',
    description: 'Czy strona jest zgodna ze standardami w3c',
    run: function (page, callback) {

        w3cjs.validate({
            file: 'http://www.radom.pl',
            output: 'json',
            callback: function (res) {
                var messages = res.messages.map(function (message) {
                    return message.type === 'error';
                });
                callback({
                    score: Math.round(100 / messages.length)
                });
            }
        });
    }
};