'use strict';

var app = require('./app'),
    phantom = require('phantom'),
    logger = require('winston');

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
        phantom.create(function (ph) {
            ph.createPage(function (page) {
                var response = {};
                page.open(target, function (status) {
                    if (status !== 'success') {
                        ph.exit();
                        callback('Could not process given url');
                    } else {
                        app.get('analysis').forEach(function (script) {
                            self.runAnalysis(script, page, function (result) {
                                response[script.name] = result;
                                if (Object.keys(response).length === app.get('analysis').length) {
                                    logger.info('Processed ' + Object.keys(response) + ' for ' + target);
                                    ph.exit();
                                    callback(response);
                                }
                            });
                        });
                    }
                });
            });
        });
    }
};

module.exports = analyser;