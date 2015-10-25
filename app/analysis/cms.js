'use strict';

module.exports = {
    name: 'cms',
    run: function (page, callback) {
        return page.evaluate(function () {
            var cmsName;
            var allMeta = document.querySelectorAll('meta[name="generator"]');
            if (allMeta.length === 1) {
                generator = allMeta[0].getAttribute('content');
                cmsName = '';
                if (generator.toLowerCase().indexOf('joomla') >= 0) {
                    cmsName = 'joomla';
                }
                if (generator.toLowerCase().indexOf('wordpress') >= 0) {
                    cmsName = 'wordpress';
                }
                if (generator.toLowerCase().indexOf('drupal') >= 0) {
                    cmsName = 'drupal';
                }
            }
            return {
                score: 100,
                cms: cmsName
            };
        }, callback);
    }
};