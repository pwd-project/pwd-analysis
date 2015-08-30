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

    it('should detect Kontakt hyperlink', function (done) {
        //given
        var htmlContactAnalysis = require('../app/analysis/contact.js');

        //when
        runAnalysis(htmlContactAnalysis, 'sites/contact.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, address: 'http://bartoszyce.pl/urzad/kontakt/'});
            done();
        }
    });

    it('should no detect Kontakt hyperlink', function (done) {
        //given
        var htmlContactAnalysis = require('../app/analysis/contact.js');

        //when
        runAnalysis(htmlContactAnalysis, 'sites/contact_no.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 0, address: ''});
            done();
        }
    });

    it('should detect cms tool Joomla', function (done) {
        //given
        var htmlCmsAnalysis = require('../app/analysis/cms.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/cms_joomla.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, cms: 'Joomla'});
            done();
        }
    });

    it('should detect cms tool Drupal', function (done) {
        //given
        var htmlCmsAnalysis = require('../app/analysis/cms.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/cms_drupal.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, cms: 'Drupal'});
            done();
        }
    });

    it('should detect other cms tool', function (done) {
        //given
        var htmlCmsAnalysis = require('../app/analysis/cms.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/cms_other.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, cms: 'Napisane w Javie'});
            done();
        }
    });

    it('should detect audio tag with autoplay', function (done) {
        //given
        var htmlCmsAnalysis = require('../app/analysis/sound.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/sound.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 0,tag: 'audio'});
            done();
        }
    });

    it('should detect audio tag without autoplay', function (done) {
        //given
        var htmlCmsAnalysis = require('../app/analysis/sound.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/sound_noauto.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100,tag: ''});
            done();
        }
    });

    it('should detect bgsound tag', function (done) {
        //given
        var htmlCmsAnalysis = require('../app/analysis/sound.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/sound_bg.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 0,tag: 'bgsound'});
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

