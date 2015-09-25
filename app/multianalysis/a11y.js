
'use strict';
var axs;

module.exports = {
    names: ['contrast', 'aria', 'labels', 'ariaRoleNotScoped', 'badAriaAttributeValue',
            'badAriaRole', 'controlsWithoutLabel', 'duplicateId', 'multipleLabelableElementsPerLabel',
            'nonExistentAriaRelatedElement', 'requiredAriaAttributeMissing', 'requiredOwnedAriaRoleMissing',
            'unsupportedAriaAttribute'],
    run: function (page, callback) {
        page.injectJs('../app/libs/axs_testing.js');
        return page.evaluate(function () {
                var axsResult = axs.Audit.run();

                var contrast = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_COLOR_01';
                });

                var aria = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_ARIA_01';
                });

                var labels = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_TEXT_01';
                });

                var ariaRoleNotScoped = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_ARIA_09';
                });

                var badAriaAttributeValue = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_ARIA_04';
                });

                var duplicateId = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_HTML_02';
                });

                var multipleLabelableElementsPerLabel = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_TEXT_03';
                });

                var nonExistentAriaRelatedElement = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_ARIA_02';
                });

                var requiredAriaAttributeMissing = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_ARIA_03';
                });

                var requiredOwnedAriaRoleMissing = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_ARIA_08';
                });

                var unsupportedAriaAttribute = axsResult.filter(function (metric) {
                    return metric.rule.code === 'AX_ARIA_10';
                });

                var result = [];
                result.push({
                        score: (contrast[0].result !== 'FAIL') * 100
                    }
                );
                result.push({
                        score: (aria[0].result !== 'FAIL') * 100
                    }
                );
                result.push({
                        score: (labels[0].result !== 'FAIL') * 100
                    }
                );
                result.push({
                        score: (ariaRoleNotScoped[0].result !== 'FAIL') * 100
                    }
                );
                result.push({
                        score: (badAriaAttributeValue[0].result !== 'FAIL') * 100
                    }
                );
                result.push({
                        score: (duplicateId[0].result !== 'FAIL') * 100
                    }
                );
                result.push({
                        score: (multipleLabelableElementsPerLabel[0].result !== 'FAIL') * 100
                    }
                );
                result.push({
                        score: (nonExistentAriaRelatedElement[0].result !== 'FAIL') * 100
                    }
                );
                result.push({
                        score: (requiredAriaAttributeMissing[0].result !== 'FAIL') * 100
                    }
                );
                result.push({
                        score: (requiredOwnedAriaRoleMissing[0].result !== 'FAIL') * 100
                    }
                );
                result.push({
                        score: (unsupportedAriaAttribute[0].result !== 'FAIL') * 100
                    }
                );
                return result;
            }, callback
        );
    }
};