/*global phantom:true, btoa:true */
'use strict';

var server = require('webserver').create();
var webPage = require('webpage');
var analyser = require('./analyser.js');
var process = require('child_process');
var execFile = process.execFile;
var requestCounter = 0;

server.listen(require('system').env.PORT || 5000, function (request, response) {
    var target = getParameterByName(request.url, 'url');
    if (request.method === 'GET' && request.url.indexOf('/analysis') > -1 && target !== '') {
        var page = webPage.create();
        page.settings.resourceTimeout = 5000;

        page.open(target, function (status, error) {
                var results = {};
                if (page.content.length > 100) {

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
                    console.log('app.js url:[' + target + '] status:[' + status + '] content:[' + page.content.length + ']');
                    analyser.getAnalysis().forEach(function (analysis) {
                        results[analysis.name] = {score: 0};
                    });
                    response.write(JSON.stringify({analysis: results, status: {responseCode: 408}}));
                    response.close();
                }
            }
        );
        requestCounter++;

        //phantom is sometimes unstable, restart it every 100 req
        if (requestCounter > 100) {
            console.log('restarting dyno');
            var actionURL = 'https://api.heroku.com/apps/pwd-analysis/dynos';
            execFile('curl', ['-I', '-X', 'DELETE', '-H', 'Accept: application/vnd.heroku+json; version=3', '--user', require('system').env.HEROKUAPI_AUTH, actionURL], null, function (err, stdout, stderr) {
                console.log('execFileSTDOUT:', JSON.stringify(stdout));
                console.log('execFileSTDERR:', JSON.stringify(stderr));
            });
        }
    }
});

function getParameterByName(url, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}