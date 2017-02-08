'use strict';

module.exports = {
    name: 'cms',
    run: (page) => {
        return page.evaluate(function () {
            var allMeta = document.querySelectorAll('meta[name="generator"]');
            var generator;
            var cmsName = '';
            if (allMeta.length === 1) {
                generator = allMeta[0].getAttribute('content');
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
                } else {
                    allMeta = document.querySelectorAll('div[class="padWrap"]');
                    if (allMeta.length > 0) {
                        cmsName = 'PAD';
                    }
                }
            }
            return {
                score: 100,
                cms: cmsName
            };
        });
    }
};