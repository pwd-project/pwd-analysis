'use strict';

var fs = require('fs');

var analyses = [];

var analysisPath = './app/analysis/';
var list = fs.list(analysisPath);
for (var x = 0; x < list.length; x++) {
    var file = analysisPath + list[x];
    if (fs.isFile(file)) {
        analyses.push(require('.' + file));
    }
}

var multiAnalyses = [];
var multiAnalysisPath = './app/multianalysis/';
var list = fs.list(multiAnalysisPath);
for (var x = 0; x < list.length; x++) {
    var file = multiAnalysisPath + list[x];
    if (fs.isFile(file)) {
        multiAnalyses.push(require('.' + file));
    }
}

module.exports = {
    getAnalysis: function () {
        return analyses;
    },
    getMultiAnalysis: function () {
        return multiAnalyses;
    }
};