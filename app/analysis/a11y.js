'use strict';
var axs;

module.exports = {
    name: 'contrast',
    run: function (page, callback) {
        page.injectJs('../app/libs/axs_testing.js');
        return page.evaluate(function () {
            if (typeof axs === 'undefined') {
                return {"score": 0};
            }
            var axsResult = axs.Audit.run().filter(function (metric) {
                return metric.rule.code === 'AX_COLOR_01';
            });
            return {
                tags: axsResult.elements,
                score: (axsResult.result !== 'FAIL') * 100
            };
        }, callback);
    }
};