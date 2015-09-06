'use strict';

var app = require('./app'),
    phantom = require('phantom'),
    logger = require('winston'),
    phantomjs;

phantom.create(function (ph) {
    phantomjs = ph;
}, {dnodeOpts: {weak: false}});

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
        var isResponseSent = false;
        var self = this;
        var targetResponseCode;
        var response = {
            analysis: {},
            status: {}
        };

        if (typeof phantomjs === 'undefined') {
            logger.error('Phantom process not found');
            callback('Phantom process not found');
        }

        phantomjs.createPage(function (page) {
            setup(page);
            page.open(target, function (status) {
                if (status === 'success') {
                    app.get('analysis').forEach(function (script) {
                        script.started = Date.now();
                        self.runAnalysis(script, page, function (result) {
                            response.analysis[script.name] = result;
                            logger.info('[' + target + '] ' + 'Processed ' + script.name + ' [' + (Date.now() - script.started) + ' ms]');
                            if (Object.keys(response.analysis).length === app.get('analysis').length) {
                                logger.info('[' + target + '] ' + 'Finished processing');
                                response.status = {responseCode: targetResponseCode};
                                page.close();
                                callback(response);
                                isResponseSent = true;
                            }
                        });
                    });
                } else {
                    if (!isResponseSent) {
                        page.close();
                        callback({analysis: {}, status: {responseCode: 404}});
                        isResponseSent = true;
                    }
                }
            });
        });

        function setup(page) {
            page.set('onResourceReceived', function (resource) {
                if (resource.url === target || resource.url === target + '/') {
                    targetResponseCode = resource.status;
                }
            });

            page.set('settings.resourceTimeout', 5000); // 5 seconds
            page.set('onResourceTimeout', function (e) {
                if (e.url === target || e.url === target + '/') {
                    if (!isResponseSent) {
                        page.close();
                        callback({analysis: {}, status: {responseCode: e.errorCode}});
                        isResponseSent = true;
                    }
                }
            });
        }
    }
};

process.on('exit', function () {
    phantomjs.exit();
});

module.exports = analyser;