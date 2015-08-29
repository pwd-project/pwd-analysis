'use strict';

module.exports = {
    name: 'cms',
    description: 'Czy strona jest budowana przy pomocy narzedzie CMS ?',
    run: function (page, callback) {
        page.evaluate(function () {
            var allMeta = document.querySelectorAll('meta[name="generator"]');
            var cmsName;
            var n;
            if (allMeta.length === 1) {
              cmsName = allMeta[0].getAttribute('content');
              n = cmsName.indexOf('Joomla');
              if (n >= 0) {
                cmsName = 'Joomla';
              } else {
                n = cmsName.indexOf('WordPress');
                if (n >= 0) {
                  cmsName = 'WordPress';
                } else {
                  n = cmsName.indexOf('Drupal');
                  if (n >= 0) {
                    cmsName = 'Drupal';
                  } else {
                    cmsName = 'Other';
                  }
                }
              }
            }
            return cmsName;
        }, function (cmsName) {
            callback({
                score: 100 * (cmsName !== ''),
                cms: cmsName
            });
        });
    }
};