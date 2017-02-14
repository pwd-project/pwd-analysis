'use strict';

const path = require('path');
const assert = require('assert');
const phantom = require('phantom');

describe('analysis tests', function () {

    it('should detect images without alt', function (done) {
        //given
        const altAnalysis = require('../app/analysis/alt.js');

        //when
        runAnalysis(altAnalysis, 'sites/withoutAlt.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {images: 4, withoutAlt: 2, score: 50});
        }
    });

    it('should detect any title', function (done) {
        //given
        const anyTitleAnalysis = require('../app/analysis/anyTitle.js');

        //when
        runAnalysis(anyTitleAnalysis, 'sites/withAnyTitle.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, title: 'TEST TITLE'});
        }
    });

    it('should detect html language attribute', function (done) {
        //given
        const htmlLangAnalysis = require('../app/analysis/htmlLang.js');

        //when
        runAnalysis(htmlLangAnalysis, 'sites/htmlLang.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, language: 'en'});
        }
    });

    it('should detect Kontakt hyperlink', function (done) {
        //given
        const htmlContactAnalysis = require('../app/analysis/contact.js');

        //when
        runAnalysis(htmlContactAnalysis, 'sites/contact.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, address: 'http://bartoszyce.pl/urzad/kontakt/'});
        }
    });

    it('should not detect Kontakt href', function (done) {
        //given
        const htmlContactAnalysis = require('../app/analysis/contact.js');

        //when
        runAnalysis(htmlContactAnalysis, 'sites/contact_no.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 0, address: ''});
        }
    });

    it('should detect cms tool Joomla', function (done) {
        //given
        const htmlCmsAnalysis = require('../app/analysis/cms.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/cms_joomla.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, cms: 'Joomla'});
        }
    });

    it('should detect cms tool Drupal', function (done) {
        //given
        const htmlCmsAnalysis = require('../app/analysis/cms.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/cms_drupal.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, cms: 'Drupal'});
        }
    });

    it('should detect cms tool Thea', function (done) {
        //given
        const htmlCmsAnalysis = require('../app/analysis/cms.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/cms_thea.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, cms: 'Thea'});
        }
    });

    it('should detect other cms tool', function (done) {
        //given
        const htmlCmsAnalysis = require('../app/analysis/cms.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/cms_other.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, cms: ''});
        }
    });

    it('should detect audio tag with autoplay', function (done) {
        //given
        const htmlCmsAnalysis = require('../app/analysis/sound.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/sound.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 0, tag: 'audio'});
        }
    });

    it('should detect audio tag without autoplay', function (done) {
        //given
        const htmlCmsAnalysis = require('../app/analysis/sound.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/sound_noauto.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 100, tag: ''});
        }
    });

    it('should detect bgsound tag', function (done) {
        //given
        const htmlCmsAnalysis = require('../app/analysis/sound.js');

        //when
        runAnalysis(htmlCmsAnalysis, 'sites/sound_bg.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {score: 0, tag: 'bgsound'});
        }
    });

    it('should detect headers without content', function (done) {
        //given
        const altAnalysis = require('../app/analysis/headerContent.js');

        //when
        runAnalysis(altAnalysis, '/sites/withoutHeaderContent.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {
                allHeaders: 6,
                h1Count: 1,
                isH1First: true,
                emptyHeaders: 2,
                headerWithChildren: 1,
                score: 80
            });
        }
    });

    it('should detect formatting tags', function (done) {
        //given
        const altAnalysis = require('../app/analysis/formattingTags.js');

        //when
        runAnalysis(altAnalysis, 'sites/withFormattingTags.html', check, done);

        //then
        function check(result) {
            assert.deepEqual(result, {formattingTags: 5, allTags: 5, score: 0});
        }
    });

    function runAnalysis(analysis, filename, check, done) {
        let _ph, _page;
        phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']).then(ph => {
            _ph = ph;
            return _ph.createPage();
        }).then(page => {
            _page = page;
            return _page.open('file:///' + path.join(__dirname, filename));
        }).then(() => {
            return analysis.run(_page);
        }).then((result) => {
            check(result);
            done();
        }).then(() => {
            _page.close();
            _ph.exit();
        }).catch(e => console.error(e));
    }
});