
'use strict';
var axs;

module.exports = {
    names: [ 'ariaOnReservedElement', 'ariaOwnsDescendant', 'ariaRoleNotScoped', 'audioWithoutControls', 'badAriaAttribute',
             'badAriaAttributeValue', 'aria', 'labels', 'duplicateId', 'focusableElementNotVisibleAndNotAriaHidden', 'linkWithUnclearPurpose',
             'contrast', 'mainRoleOnInappropriateElement', 'elementsWithMeaningfulBackgroundImage', 'multipleAriaOwners',
             'multipleLabelableElementsPerLabel', 'nonExistentAriaRelatedElement', 'requiredAriaAttributeMissing',
             'requiredOwnedAriaRoleMissing', 'unsupportedAriaAttribute'],

    run: function (page, callback) {
        page.injectJs('../app/libs/axs_testing.js');
        return page.evaluate(function () {
                var axsResult = axs.Audit.run();

                var codes = ['AX_ARIA_09', 'AX_ARIA_04', 'AX_ARIA_01', 'AX_TEXT_01', 'AX_HTML_02', 'AX_TEXT_03',
                             'AX_ARIA_02', 'AX_ARIA_03', 'AX_ARIA_08', 'AX_ARIA_10', 'AX_TEXT_04', 'AX_COLOR_01',
                             'AX_ARIA_12', 'AX_ARIA_06', 'AX_AUDIO_01', 'AX_ARIA_11', 'AX_IMAGE_01', 'AX_FOCUS_01',
                             'AX_ARIA_05', 'AX_ARIA_07'];

                var metrics= axsResult.filter(function (metric) {
                    return codes.indexOf(metric.rule.code)>=0;
                });

                var result = [];
                metrics.forEach(function(metric){
                    result.push({
                            score: (metric.result !== 'NA')?((metric.result !== 'FAIL') * 100):-1,
                            originalName: metric.rule.name
                        }
                    );
                });

                return result;
            }, callback
        );
    }
};
