/*global phantom:false */
'use strict';

var server = require('webserver').create();
var webPage = require('webpage');
var analyser = require('./analyser.js');
var requestCounter = 0;

server.listen(require('system').env.PORT || 5000, function (request, response) {
    var target = getParameterByName(request.url, 'url');
    if (request.method === 'GET' && request.url.indexOf('/analysis') > -1 && target !== '') {
        var page = webPage.create();
        page.settings.resourceTimeout = 5000;

        page.open(target, function (status, error) {
                var results = {};
                if (status === 'success') {

                    analyser.getAnalysis().forEach(function (analysis) {
                        results[analysis.name] = analysis.run(page);
                        if (results[analysis.name] === null) {
                            results[analysis.name] = {score: 0};
                            console.log('metric [' + analysis.name + '] did not return a valid report, sending score 0');
                        }
                    });

                    analyser.getMultiAnalysis().forEach(function (multiAnalysis) {
                        var multiAnalysisResult = multiAnalysis.run(page);
                        if (multiAnalysisResult === null || multiAnalysisResult.length === 0) {
                            multiAnalysisResult = [];
                            multiAnalysis.names.forEach(function (name) {
                                multiAnalysisResult.push({score: 0});
                            });
                        }
                        multiAnalysisResult.forEach(function (result, index) {
                            results[multiAnalysis.names[index]] = result;
                        });
                    });

                    response.statusCode = 200;
                    response.write(JSON.stringify({analysis: results, status: {responseCode: 200}}));
                    response.close();
                    page.close();
                } else {
                    analyser.getAnalysis().forEach(function (analysis) {
                        results[analysis.name] = {score: 0};
                    });
                    response.write(JSON.stringify({analysis: results, status: {responseCode: 408}}));
                    response.close();
                }
            }
        );
        requestCounter++;

        //phantom is sometimes unstable, restart it every 300 req
        if (requestCounter > 300) {
            phantom.exit();
        }

    }
});

function getParameterByName(url, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}