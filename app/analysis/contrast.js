'use strict';

module.exports = {
    name: 'contrast',
    description: 'Czy kontrast jest wystarczający',
    run: function (page, callback) {
        page.injectJs('../../node_modules/accessibility-developer-tools/dist/js/axs_testing.js', function(){
            page.evaluate(function () {
                return axs.Audit.run();
            }, function(report){
                var axsResult = report.filter(function(metric){
                    return metric.rule.code == 'AX_COLOR_01'
                });
                console.log(axsResult);
                callback({
                    tags: axsResult.elements,
                    score: (axsResult.result !== 'FAIL') * 100
                });
            });
        });

    }
};