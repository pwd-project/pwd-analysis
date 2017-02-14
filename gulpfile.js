'use strict';

var gulp = require('gulp');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');

var handleErr = function (err) {
    console.log(err.message);
    process.exit(1);
};

gulp.task('static', function () {
    return gulp.src('**/*.js')
        .pipe(excludeGitignore())
        .on('error', handleErr);
});

gulp.task('test', ['static'], function (done) {
    var mochaErr;
    gulp.src('test/**/*.js')
        .pipe(mocha({reporter: 'spec', timeout: 5000}))
        .on('end', done);
});

gulp.task('default', ['test']);
