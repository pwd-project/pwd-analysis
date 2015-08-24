# pwd-analysis [![Build Status][travis-image]][travis-url]

## Step 1 – Install Node.js
> Head on over to http://nodejs.org and click install – this should use magic to figure out what OS and version.

## Step 2 – Install dependencies
> Open command prompt – (run cmd) then type ‘npm install’ in repository folder – if there is no  error you’ve installed Node.js correctly yay!
Otherwise make sure you close and reopen command prompt if it was open during install. Or try rebooting – reinstalling, the usual.

## Step 3 – Run
To start application
> npm start

You can check it at:
> http://localhost:5000/analysis?url=http://javers.org

## Step 4 – Lint & Test
> npm test

If you cannot run tests, try installing gulp globally
> npm install -g gulp

[travis-image]: https://api.travis-ci.org/pwd-project/pwd-analysis.svg?branch=master
[travis-url]: https://api.travis-ci.org/pwd-project/pwd-analysis