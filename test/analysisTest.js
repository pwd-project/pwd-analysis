'use strict';

var path = require('path');
var assert = require('assert');
var phantom = require('phantom');

var webpage;
var phantomjs;

describe('pwd-analysis tests', function () {

    it('should detect images without alt', function (done) {
        //given
        var altAnalysis = require('../app/analysis/alt.js');

        //when
        runAnalysis(altAnalysis, 'sites/withoutAlt.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {images: 4, withoutAlt: 2, score: 50});
            done();
        }
    });

    it('should detect any title', function (done) {
        //given
        var anyTitleAnalysis = require('../app/analysis/anyTitle.js');

        //when
        runAnalysis(anyTitleAnalysis, 'sites/withAnyTitle.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, title: 'TEST TITLE'});
            done();
        }
    });

    it('should detect html language attribute', function (done) {
        //given
        var htmlLangAnalysis = require('../app/analysis/htmlLang.js');

        //when
        runAnalysis(htmlLangAnalysis, 'sites/htmlLang.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, language: 'en'});
            done();
        }
    });

    it('should detect headers without content', function (done) {
            //given
            var altAnalysis = require('../app/analysis/headerContent.js');

            //when
            runAnalysis(altAnalysis, '/sites/withoutHeaderContent.html', check);

            //then
            function check(result) {
                assert.deepEqual(result, {allHeaders:6,h1Count:1,isH1First:true,emptyHeaders:2,headerWithChildren:1,score:80});
                done();
            }
        });

    function runAnalysis(analysis, filename, check) {
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, filename), function () {
                analysis.run(webpage, check);
            });
        });
    }

});

before(function (done) {
    this.timeout(5000);
    phantom.create(function (ph) {
        phantomjs = ph;
        done();
    }, {path: path.dirname(require('phantomjs').path) + '/', dnodeOpts: {weak: false}});
});

afterEach(function () {
    if (webpage !== null) {
        webpage.close();
        webpage = null;
    }
});

after(function () {
    phantomjs.exit();
});
