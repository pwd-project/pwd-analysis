'use strict';

var path = require('path');
var assert = require('assert');
var phantom = require('phantom');

var webpage;
var phantomjs;

describe('analysis tests', function () {

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
            assert.deepEqual(result, {score: 100, cms: 'joomla'});
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
            assert.deepEqual(result, {score: 100, cms: 'drupal'});
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
            assert.deepEqual(result, {score: 100, cms: ''});
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
            assert.deepEqual(result, {score: 0, tag: 'audio'});
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
            assert.deepEqual(result, {score: 100, tag: ''});
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
            assert.deepEqual(result, {score: 0, tag: 'bgsound'});
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
            assert.deepEqual(result, {allHeaders: 6, h1Count: 1, isH1First: true, emptyHeaders: 2, headerWithChildren: 1, score: 80});
            done();
        }
    });

    it('should detect formatting tags', function (done) {
        //given
        var altAnalysis = require('../app/analysis/formattingTags.js');

        //when
        runAnalysis(altAnalysis, 'sites/withFormattingTags.html', check);

        //then
        function check(result) {
            assert.deepEqual(result, {formattingTags: 5, allTags: 5, score: 0});
            done();
        }
    });

    it('should detect valid contrast', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/contrast.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'lowContrastElements';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });


    it('should detect invalid contrast', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/contrast_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'lowContrastElements';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect valid aria labels', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/aria.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'badAriaRole';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect invalid aria labels', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/aria_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'badAriaRole';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect valid input labels', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/labels.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'controlsWithoutLabel';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect invalid input and button labels', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/labels_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'controlsWithoutLabel';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect scoped aria roles', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/ariaRolesScoped.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'ariaRoleNotScoped';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect invalid scope of aria roles', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/ariaRolesNotScoped.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'ariaRoleNotScoped';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect valid aria role attributes', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/ariaRolesAttribute.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'badAriaAttributeValue';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect invalid aria role attributes', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/ariaRolesAttribute_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'badAriaAttributeValue';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect unique id in html elements', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/uniqueId.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'duplicateId';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect non unique id in html elements', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/uniqueId_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'duplicateId';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect existing DOM elements referred by ARIA attribute', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/labelExisting.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'nonExistentAriaRelatedElement';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect non existing DOM elements referred by ARIA attribute', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/labelExisting_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'nonExistentAriaRelatedElement';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect attributes required by ARIA role', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/ariaRoleRequiredAttributes.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'requiredAriaAttributeMissing';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect required owned elements', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/requiredAriaRole.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'requiredOwnedAriaRoleMissing';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect missing required owned elements', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/requiredAriaRole_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'requiredOwnedAriaRoleMissing';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect supported ARIA attributes', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/supportedAriaAttributes.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'unsupportedAriaAttribute';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect unsupported ARIA attributes', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/supportedAriaAttributes_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'unsupportedAriaAttribute';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect if element supports ARIA roles, states and properties ', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/ariaOnReservedElement.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'ariaOnReservedElement';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect if element does not support ARIA roles, states and properties', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/ariaOnReservedElement_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'ariaOnReservedElement';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect whether aria-owns is not used if ownership is implicit in the DOM', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/ariaOwnsDescendant.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'ariaOwnsDescendant';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect whether aria-owns is used if ownership is implicit in the DOM', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/ariaOwnsDescendant_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'ariaOwnsDescendant';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect if element has a valid ARIA attribute', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/badAriaAttribute.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'badAriaAttribute';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect if element has an invalid ARIA attribute', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/badAriaAttribute_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'badAriaAttribute';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect if elements which are focusable are not invisible nor obscured by another element', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/focus.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'focusableElementNotVisibleAndNotAriaHidden';
            });
            assert.deepEqual(res[0].score, 100);
            done();
        }
    });

    it('should detect if elements which are focusable are either invisible or obscured by another element', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/focus_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'focusableElementNotVisibleAndNotAriaHidden';
            });
            assert.deepEqual(res[0].score, 0);
            done();
        }
    });

    it('should detect if elements ID is not present in more than one aria-owns attribute at any time', function (done) {
        //given
        var a11y = require('../app/multianalysis/a11y.js');

        //when
        phantomjs.createPage(function (page) {
            webpage = page;
            webpage.open('file:///' + path.join(__dirname, 'sites/multipleAriaOwners_no.html'), function () {
                webpage.injectJs('app/libs/axs_testing.js', function () {
                    a11y.run(webpage, check);
                });
            });
        });

        //then
        function check(result) {
            var res = result.filter(function(r){
                return r.originalName === 'multipleAriaOwners';
            });
            assert.deepEqual(res[0].score, 0);
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

