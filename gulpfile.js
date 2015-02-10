'use strict';

var gulp = require('gulp-help')(require('gulp')),
    plugins = require('gulp-load-plugins')(),
    gulpif = require('gulp-if'),
    browserSync = require('browser-sync');

var isProduction = process.env.NODE_ENV === 'production';

var path = {
        html: ['*.html', 'src/**/*.html'],
        scripts: 'src/**/*.js',
        styles: 'sass/**/*.scss'
    };

gulp.task('browser-sync', function() {
    browserSync.init({
        files: [
            path.html,
            'css/*.css',
            'dist/*.js'
        ],
        server: {
            baseDir: ['./']
        },
        notify: true
    });
});

gulp.task('scripts', function() {
    return gulp.src(path.scripts)
        .pipe(plugins.plumber({
            errorHandler: handleError
        }))
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.ngAnnotate())
        .pipe(gulpif(isProduction, plugins.uglify()))
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('sass', function() {
    var config = {
        sourcemap: !isProduction,
        style: isProduction ? 'compressed' : 'expanded'
    };

    return plugins.rubySass('sass', config)
        .on('error', handleError)
        .pipe(plugins.autoprefixer('last 2 versions', 'ie 9'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('css'));
});

gulp.task('default', ['sass', 'scripts']);

gulp.task('watch', 'Start browser-sync and refresh browser on file changes', ['sass', 'scripts', 'browser-sync'], function () {
    gulp.watch(path.styles, ['sass']);
    gulp.watch(path.scripts, ['scripts']);
});

/**
 * Displays error message in the console
 * @param error
 */
function handleError(error) {
    plugins.util.beep();
    plugins.util.log(plugins.util.colors.red(error));
}
