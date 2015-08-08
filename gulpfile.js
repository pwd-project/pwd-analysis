'use strict';
var gulp = require('gulp');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');

var handleErr = function (err) {
    console.log(err.message);
    process.exit(1);
};

gulp.task('static', function () {
    return gulp.src('**/*.js')
        .pipe(excludeGitignore())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', handleErr);
});

gulp.task('test', ['static'], function (done) {
    var mochaErr;
    gulp.src('test/**/*.js')
        .pipe(mocha({reporter: 'spec'}))
        .on('end', done);
});

gulp.task('default', ['test']);
