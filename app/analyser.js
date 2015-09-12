'use strict';

var fs = require('fs');

var analyses = [];

var path = './app/analysis/';
var list = fs.list(path);
for (var x = 0; x < list.length; x++) {
    var file = path + list[x];
    if (fs.isFile(file)) {
        analyses.push(require('.' + file));
    }
}

module.exports = {
    getAnalysis: function () {
        return analyses;
    }
};