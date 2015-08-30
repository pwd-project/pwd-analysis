'use strict';

module.exports = {
    name: 'cms',
    description: 'Czy strona jest budowana przy pomocy narzedzie CMS ?',
    run: function (page, callback) {
        page.evaluate(function () {
            var allMeta = document.querySelectorAll('meta[name="generator"]');
            var cmsName;
            if (allMeta.length === 1) {
              cmsName = allMeta[0].getAttribute('content');
              if (cmsName.toLowerCase().indexOf('joomla') >= 0) {
                cmsName = 'Joomla';
              }
              if (cmsName.toLowerCase().indexOf('wordpress') >= 0) {
                cmsName = 'WordPress';
              }
              if (cmsName.toLowerCase().indexOf('drupal') >= 0) {
                cmsName = 'Drupal';
              }
            }
            return cmsName;
        }, function (cmsName) {
            callback({
                score: 100,
                cms: cmsName
            });
        });
    }
};