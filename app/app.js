'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    logger = require('winston'),
    psi = require('psi');

var app = module.exports = express();

app.use(bodyParser.json());
app.use(cors());

app.set('port', (process.env.PORT || 5000));
app.set('analysis', []);

var analyser = require('./analyser.js');
analyser.loadAnalysis('./analysis/');

app.get('/analysis', function (req, resp) {
    var target = req.query.url;
    logger.info('Received url to process', target);
    analyser.analyse(target, function (response) {
        resp.json(response);
        resp.end();
    });
});

app.get('/metrics', function (req, resp) {
    var target = req.query.url;
    logger.info('Received url for speed analysis', target)
    psi(target, function (err, data) {
        if (err) {
            resp.json(err);
        } else {
            resp.json(data);
        }
        resp.end();
    });
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

