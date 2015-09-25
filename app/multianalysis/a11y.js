
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

                var codes = ['AX_ARIA_09', 'AX_ARIA_04', 'AX_ARIA_01', 'AX_TEXT_01', 'AX_HTML_02',
                             'AX_TEXT_03', 'AX_ARIA_02', 'AX_ARIA_03', 'AX_ARIA_08', 'AX_ARIA_10',
                             'AX_COLOR_01'];

                var metrics= axsResult.filter(function (metric) {
                    return codes.indexOf(metric.rule.code)>=0;
                });

                /*var contrast = axsResult.filter(function (metric) {
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
*/
                var result = [];
                metrics.forEach(function(metric){
                    result.push({
                            score: (metric.result !== 'FAIL') * 100,
                            originalName: metric.rule.name
                        }
                    );
                });

                return result;
            }, callback
        );
    }
};