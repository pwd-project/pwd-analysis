
'use strict';
var axs;

module.exports = {
    names: [ 'ariaRoleNotScoped', 'badAriaAttributeValue', 'aria', 'labels',
             'duplicateId', 'contrast', 'multipleLabelableElementsPerLabel', 'nonExistentAriaRelatedElement',
             'requiredAriaAttributeMissing', 'requiredOwnedAriaRoleMissing',
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