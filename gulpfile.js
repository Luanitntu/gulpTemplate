import gulp from 'gulp';

const { src, dest, series, parallel, watch } = gulp;

// GULP SASS
import gulpSass from "gulp-sass";
import nodeSass from "node-sass";
const sass = gulpSass(nodeSass);
import beautify from 'gulp-cssbeautify';

import concat from 'gulp-concat';

// GULP IMAGE
import imagemin from 'gulp-imagemin';
import gifsicle from 'imagemin-gifsicle';
import jpegtran from 'imagemin-jpegtran';
import optipng from 'imagemin-jpegtran'
import svgo from 'imagemin-svgo';

import browserSync  from 'browser-sync';
import livereload  from 'gulp-livereload';
import notify  from 'gulp-notify';
import plumber from 'gulp-plumber';

browserSync.create();
const files = {
    scssSrc: 'source/scss/**/*.scss',
    cssDest: 'public/assets/css',
    reponsiveSrc: 'source/scss/responsive.scss',
    reponsiveDest: 'public/assets/css/',
    jsSrc: 'source/js/*.js',
    jsDest: 'public/assets/js/',
    imgSrc: 'source/images/*',
    imgDest: 'public/assets/images'
}

// Error message
var onError = function(err) {
    notify.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: < %= error.message %>',
        sound: 'Beep'
    })(err);

    this.emit('end');
};
/**
 * *Optimize images
 * @returns 
 */
function images() {
    return src(files.imgSrc)
        .pipe(imagemin([
            gifsicle({ interlaced: true }),
            jpegtran({ progressive: true }),
            optipng({ optimizationLevel: 7 }),
            svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(livereload())
        .pipe(dest(files.imgDest));
}


/**
 * *Complie JS
 * @returns 
 */
function jsTask() {
    return src(files.jsSrc, { sourcemaps: true })
        .pipe(concat('myscript.js'))
        .pipe(dest(files.jsDest), { sourcemaps: true })
        .pipe(livereload());
}

/**
 * *Complie SCSS
 * @returns 
 */
function scssTask() {
    return src(files.scssSrc)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sass().on('error', sass.logError))
        .pipe(beautify())
        .pipe(dest(files.cssDest))
        .pipe(livereload())
        .pipe(browserSync.stream());
}

/**
 * *Move responsive
 * @returns 
 */
function reponsiveTask() {
    return src(files.reponsiveSrc)
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(beautify())
        .pipe(dest(files.reponsiveDest))
        .pipe(livereload())
        .pipe(browserSync.stream());
}

/**
 * *Watch all gulp task
 */
function watchTask() {
    browserSync.init({
        server: {
            baseDir: ["./public"]
        },
        open: true,
        ghostMode: {
            clicks: false,
            scroll: false,
            forms: {
                submit: false,
                inputs: false,
                toggles: true
            }
        },
        watch: true,
    });
    livereload.listen();
    watch([files.scssSrc], scssTask); //css
    watch([files.reponsiveSrc], reponsiveTask); // responsive
    watch([files.jsSrc], jsTask); // js
    watch([files.imgSrc], images); // images
    watch(['./public/*.html']).on('change', browserSync.reload);
}

const build = watchTask();
export default build;