var webPage = require('webpage');

var actionURL = 'https://api.heroku.com/apps/pwd-analysis/dynos';
var actionPage = webPage.create();
actionPage.customHeaders = {
    'Accept': 'application/vnd.heroku+json; version=3',
    'Authorization': 'Basic ' + btoa(require('system').env.HEROKUAPI_AUTH)
};
actionPage.open(actionURL, 'DELETE', {}, function (status) {
    console.log('restart dyno status: ' + status);
    phantom.exit();
});