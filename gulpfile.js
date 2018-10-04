/**
 * Created by cesarmejia on 22/08/2017.
 */
const gulp         = require('gulp');
const concat       = require('gulp-concat');
const stylus       = require('gulp-stylus');
const typescript   = require('gulp-typescript');
const uglify       = require('gulp-uglify');
const plumber      = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const livereload   = require('gulp-livereload');


let srcPath = {
    styl: 'src/styl/',
    ts  : 'src/ts/',
    root: 'src/'
};

let destPath = {
    css : 'public/css/',
    js  : 'public/js/',
    root: 'public/'
};

// ---------------------------------------------------------------------
// | Maintains updated src changes in the browser.                     |
// ---------------------------------------------------------------------

/**
 * Reload on change.
 */
gulp.task('reload', ['stylus', 'ts'], () => {
    gulp.src(srcPath.root)
        .pipe(livereload());
});

/**
 * Monitors changes in projects files and apply changes instantly.
 * Use with livereload chrome extension.
 * Reference: https://github.com/vohof/gulp-livereload
 */
gulp.task('watch', () => {
    // Files to be watched.
    let files = [
        srcPath.ts   + '**/*.ts',
        srcPath.styl + '**/*.styl',
        srcPath.root + '*.html'
    ];

    livereload.listen();

    gulp.watch(files, ['reload']);
});


// ---------------------------------------------------------------------
// | Build production project.                                         |
// ---------------------------------------------------------------------

/**
 * Transpile stylus files.
 * Reference: https://github.com/stevelacy/gulp-stylus
 */
gulp.task('stylus', () => {
    // Source files.
    let srcFiles = `${srcPath.styl}**/*.styl`;

    let autoPrefixerOpts = {
        browsers: 'last 2 versions',
        cascade: true
    };

    // Output file.
    let outputFile = 'styles.css';

    return gulp.src(srcFiles)
        .pipe(plumber())
        .pipe(stylus())
        .pipe(concat(outputFile))
        .pipe(autoprefixer(autoPrefixerOpts))
        .pipe(gulp.dest(destPath.css));
});


/**
 * Concatenate and compile typescript files.
 * Reference: https://www.npmjs.com/package/gulp-typescript/
 */
gulp.task('ts', () => {
    let opts = {
        target        : 'ES5',
        removeComments: false,
        noImplicitAny : false
    };

    // Source files.
    let srcFiles = [
        `${srcPath.ts}core/*.ts`,
        `${srcPath.ts}util/*.ts`,
        `${srcPath.ts}*.ts`
    ];

    // Output file.
    let outputFile = 'pl-scrollfire.min.ts';
    // let outputFile = 'pl-scrollfire.ts';

    return gulp.src(srcFiles)
        .pipe(plumber())
        .pipe(concat(outputFile))
        .pipe(typescript(opts))
        .pipe(uglify())
        .pipe(gulp.dest(destPath.js));
});