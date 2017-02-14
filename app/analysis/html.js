'use strict';

const axios = require('axios');

module.exports = {
    name: 'html',
    run: function (page) {
        return axios.get('https://validator.w3.org/nu/?doc=' + page.url + '&out=json')
            .then(function (response) {
                const result = response.data;
                const errors = result.messages.filter(function (message) {
                    return message.type === 'error';
                });
                const warnings = result.messages.filter(function (message) {
                    return message.type === 'warning';
                });
                return {'score': Math.max(0, 100 - (errors.length * 5 + warnings.length * 1))};
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};