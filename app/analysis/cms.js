'use strict';

module.exports = {
    name: 'cms',
    run: function (page, callback) {
        return page.evaluate(function () {
            var allMeta = document.querySelectorAll('meta[name="generator"]');
            var generator;
            var cmsName;
            if (allMeta.length === 1) {
                generator = allMeta[0].getAttribute('content');
                cmsName = '';
                if (generator.toLowerCase().indexOf('joomla') >= 0) {
                    cmsName = 'Joomla';
                }
                if (generator.toLowerCase().indexOf('wordpress') >= 0) {
                    cmsName = 'WordPress';
                }
                if (generator.toLowerCase().indexOf('drupal') >= 0) {
                    cmsName = 'Drupal';
                }
            } else {
              if (document.querySelectorAll('a[href="http://cmsthea.pl"]').length > 0) {
                cmsName = 'Thea';
              }
            }
            return {
                score: 100,
                cms: cmsName
            };
        }, callback);
    }
};