'use strict';

module.exports = {
    name: 'cms',
    run: function (page, callback) {
        return page.evaluate(function () {
            var cmsName;
            var allMeta = document.querySelectorAll('meta[name="generator"]');
            if (allMeta.length === 1) {
                cmsName = allMeta[0].getAttribute('content');
                if (cmsName.toLowerCase().indexOf('joomla') >= 0) {
                    cmsName = 'joomla';
                }
                if (cmsName.toLowerCase().indexOf('wordpress') >= 0) {
                    cmsName = 'wordpress';
                }
                if (cmsName.toLowerCase().indexOf('drupal') >= 0) {
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