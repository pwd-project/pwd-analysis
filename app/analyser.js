'use strict';

var app = require('./app'),
    phantom = require('phantom'),
    logger = require('winston'),
    phantomjs;

phantom.create(function (ph) {
    phantomjs = ph;
});

var analyser = {

    loadAnalysis: function (directory) {
        var normalizedPath = require('path').join(__dirname, directory);
        require('fs').readdirSync(normalizedPath).forEach(function (file) {
            app.get('analysis').push(require('./' + directory + file));
        });
    },

    runAnalysis: function (script, page, callback) {
        script.run(page, callback);
    },

    analyse: function (target, callback) {
        var self = this;
        phantomjs.createPage(function (page) {
            var response = {};
            page.open(target, function (status) {
                if (status !== 'success') {
                    callback('Could not process given url');
                } else {
                    app.get('analysis').forEach(function (script) {
                        self.runAnalysis(script, page, function (result) {
                            response[script.name] = result;
                            if (Object.keys(response).length === app.get('analysis').length) {
                                logger.info('Processed ' + Object.keys(response) + ' for ' + target);
                                page.close();
                                callback(response);
                            }
                        });
                    });
                }
            });
        });
    }
};

process.on('exit', function () {
    phantomjs.exit();
});

module.exports = analyser;