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
                var codes = ['AX_COLOR_01', 'AX_ARIA_01', 'AX_TEXT_01', 'AX_ARIA_09', 'AX_ARIA_04', 'AX_HTML_02',
                             'AX_TEXT_03', 'AX_ARIA_02', 'AX_ARIA_03', 'AX_ARIA_08', 'AX_ARIA_10'];

                var axsResult = axs.Audit.run();

                var metricValues = axsResult.filter(function (metric) {
                    return codes.includes(metric.rule.code);
                });

                var contrast = metricValues[0];
                var aria = metricValues[1];
                var labels = metricValues[2];
                var ariaRoleNotScoped = metricValues[3];
                var badAriaAttributeValue = metricValues[4];
                var duplicateId = metricValues[5];
                var multipleLabelableElementsPerLabel = metricValues[6];
                var nonExistentAriaRelatedElement = metricValues[7];
                var requiredAriaAttributeMissing = metricValues[8];
                var requiredOwnedAriaRoleMissing = metricValues[9];
                var unsupportedAriaAttribute = metricValues[10];

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