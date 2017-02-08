'use strict';
const fs = require('fs');
const ANALYSIS_PATH = './app/analysis/';
const MULTIANALYSIS_PATH = './app/multianalysis/';

module.exports = class Analyser {
    constructor() {
        fs.readdir(ANALYSIS_PATH, (err, items) => {
            if (err) throw new err;
            this._analyses = items.map(it => ANALYSIS_PATH + it)
                .filter(it => fs.statSync(it).isFile(it))
                .map(file => require('.' + file));
        });
        fs.readdir(MULTIANALYSIS_PATH, (err, items) => {
            if (err) throw new err;
            this._multiAnalyses = items.map(it => MULTIANALYSIS_PATH + it)
                .filter(it => fs.statSync(it).isFile())
                .map(file => require('.' + file));
        });
    }

    get analyses() {
        return this._analyses;
    }

    get multiAnalyses() {
        return this._multiAnalyses;
    }
};