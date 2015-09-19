'use strict';
var axs;

module.exports = {
    names: ['contrast', 'aria', 'labels'],
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
                return result;
            }, callback
        );
    }
};