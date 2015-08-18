'use strict';

var app = require('./app'),
    phantom = require('phantom'),
    logger = require('winston'),
    phantomjs;

phantom.create(function (ph) {
    phantomjs = ph;
}, { dnodeOpts: {weak: false} });

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
        var targetResponseCode;
        phantomjs.createPage(function (page) {
            var response = {analysis:{}};
            page.set('settings.resourceTimeout', 5000);
            page.set('onResourceTimeout', function (e) {
                page.close();
                callback({status : {responseCode: e.errorCode}});
            });

            page.set('onResourceReceived', function (resource) {
                if (resource.url === target || resource.url === target+'/') {
                    targetResponseCode = resource.status;
                }
            });

            page.open(target, function (status) {
                if (status === 'success') {
                    app.get('analysis').forEach(function (script) {
                        self.runAnalysis(script, page, function (result) {
                            response.analysis[script.name] = result;
                            if (Object.keys(response.analysis).length === app.get('analysis').length) {
                                logger.info('Processed ' + Object.keys(response) + ' for ' + target);
                                page.close();
                                response.status = {responseCode: targetResponseCode};
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