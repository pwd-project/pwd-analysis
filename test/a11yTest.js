'use strict';

const path = require('path');
const assert = require('assert');
const phantom = require('phantom');
const a11y = require('../app/multianalysis/a11y.js');

describe('a11y scores test', function () {

        it('should detect valid contrast', function (done) {
            //expect
            runA11y('sites/contrast.html', (result) => checkScore(result, 'lowContrastElements', 100, done));
        });

        it('should detect invalid contrast', function (done) {
            //expect
            runA11y('sites/contrast_no.html', (result) => checkScore(result, 'lowContrastElements', 0, done));
        });

        it('should detect valid aria labels', function (done) {
            //expect
            runA11y('sites/aria.html', (result) => checkScore(result, 'badAriaRole', 100, done));
        });

        it('should detect invalid aria labels', function (done) {
            //expect
            runA11y('sites/aria_no.html', (result) => checkScore(result, 'badAriaRole', 0, done));
        });

        it('should detect valid input labels', function (done) {
            //expect
            runA11y('sites/labels.html', (result) => checkScore(result, 'controlsWithoutLabel', 100, done));
        });

        it('should detect invalid input and button labels', function (done) {
            //expect
            runA11y('sites/labels_no.html', (result) => checkScore(result, 'controlsWithoutLabel', 0, done));
        });

        it('should detect scoped aria roles', function (done) {
            //expect
            runA11y('sites/ariaRolesScoped.html', (result) => checkScore(result, 'ariaRoleNotScoped', 100, done));
        });

        it('should detect invalid scope of aria roles', function (done) {
            //expect
            runA11y('sites/ariaRolesNotScoped.html', (result) => checkScore(result, 'ariaRoleNotScoped', 0, done));
        });

        it('should detect valid aria role attributes', function (done) {
            //expect
            runA11y('sites/ariaRolesAttribute.html', (result) => checkScore(result, 'badAriaAttributeValue', 100, done));
        });

        it('should detect invalid aria role attributes', function (done) {
            //expect
            runA11y('sites/ariaRolesAttribute_no.html', (result) => checkScore(result, 'badAriaAttributeValue', 0, done));
        });

        it('should detect unique id in html elements', function (done) {
            //expect
            runA11y('sites/uniqueId.html', (result) => checkScore(result, 'duplicateId', 100, done));
        });

        it('should detect non unique id in html elements', function (done) {
            //expect
            runA11y('sites/uniqueId_no.html', (result) => checkScore(result, 'duplicateId', 0, done));
        });

        it('should detect existing DOM elements referred by ARIA attribute', function (done) {
            //expect
            runA11y('sites/labelExisting.html', (result) => checkScore(result, 'nonExistentAriaRelatedElement', 100, done));
        });

        it('should detect non existing DOM elements referred by ARIA attribute', function (done) {
            //expect
            runA11y('sites/labelExisting_no.html', (result) => checkScore(result, 'nonExistentAriaRelatedElement', 0, done));
        });

        it('should detect attributes required by ARIA role', function (done) {
            //expect
            runA11y('sites/ariaRoleRequiredAttributes.html', (result) => checkScore(result, 'requiredAriaAttributeMissing', 100, done));
        });

        it('should detect required owned elements', function (done) {
            //expect
            runA11y('sites/requiredAriaRole.html', (result) => checkScore(result, 'requiredOwnedAriaRoleMissing', 100, done));
        });

        it('should detect missing required owned elements', function (done) {
            //expect
            runA11y('sites/requiredAriaRole_no.html', (result) => checkScore(result, 'requiredOwnedAriaRoleMissing', 0, done));
        });

        it('should detect supported ARIA attributes', function (done) {
            //expect
            runA11y('sites/supportedAriaAttributes.html', (result) => checkScore(result, 'unsupportedAriaAttribute', 100, done));
        });

        it('should detect unsupported ARIA attributes', function (done) {
            //expect
            runA11y('sites/supportedAriaAttributes_no.html', (result) => checkScore(result, 'unsupportedAriaAttribute', 0, done));
        });

        it('should detect if element supports ARIA roles, states and properties ', function (done) {
            //expect
            runA11y('sites/ariaOnReservedElement.html', (result) => checkScore(result, 'ariaOnReservedElement', 100, done));
        });

        it('should detect if element does not support ARIA roles, states and properties', function (done) {
            //expect
            runA11y('sites/ariaOnReservedElement_no.html', (result) => checkScore(result, 'ariaOnReservedElement', 0, done));
        });

        it('should detect whether aria-owns is not used if ownership is implicit in the DOM', function (done) {
            //expect
            runA11y('sites/ariaOwnsDescendant.html', (result) => checkScore(result, 'ariaOwnsDescendant', 100, done));
        });

        it('should detect whether aria-owns is used if ownership is implicit in the DOM', function (done) {
            //expect
            runA11y('sites/ariaOwnsDescendant_no.html', (result) => checkScore(result, 'ariaOwnsDescendant', 0, done));
        });

        it('should detect if element has a valid ARIA attribute', function (done) {
            //expect
            runA11y('sites/badAriaAttribute.html', (result) => checkScore(result, 'badAriaAttribute', 100, done));
        });

        it('should detect if element has an invalid ARIA attribute', function (done) {
            //expect
            runA11y('sites/badAriaAttribute_no.html', (result) => checkScore(result, 'badAriaAttribute', 0, done));
        });

        it('should detect if elements which are focusable are not invisible nor obscured by another element', function (done) {
            //expect
            runA11y('sites/focus.html', (result) => checkScore(result, 'focusableElementNotVisibleAndNotAriaHidden', 100, done));
        });

        it('should detect if elements which are focusable are either invisible or obscured by another element', function (done) {
            //expect
            runA11y('sites/focus_no.html', (result) => checkScore(result, 'focusableElementNotVisibleAndNotAriaHidden', 0, done));
        });

        it('should detect if elements ID is not present in more than one aria-owns attribute at any time', function (done) {
            //expect
            runA11y('sites/multipleAriaOwners_no.html', (result) => checkScore(result, 'multipleAriaOwners', 0, done));
        });

        function checkScore(result, metric, expectedScore, callback) {
            const score = result.filter((r) => r.originalName === metric).map(it => it.score).join();
            assert.equal(score, expectedScore);
            callback();
        }

        function runA11y(filename, check) {
            const a11y = require('../app/multianalysis/a11y.js');
            let _ph, _page;
            phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']).then(ph => {
                _ph = ph;
                return _ph.createPage();
            }).then(page => {
                _page = page;
                return _page.open('file:///' + path.join(__dirname, filename));
            }).then(() => {
                return a11y.run(_page);
            }).then((it) => {
                check(it);
            }).then(() => {
                _page.close();
                _ph.exit();
            }).catch(e => console.error(e));
        }
    }
);