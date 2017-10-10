const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const concat = require('gulp-concat');
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const pump = require('pump');
const rename = require('gulp-rename');
const sequence = require('gulp-sequence');
const uglify = require('gulp-uglify-es').default;
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const tslint = require('gulp-tslint');

const OUTPUT_FILE = 'LogoApp.js';
const OUTPUT_DIR = 'public/bin';

function copyFile(srcFile, destFile) {
  fs.writeFileSync(destFile, fs.readFileSync(srcFile));
}

gulp.task('default', sequence('test'));
gulp.task('test', sequence('build', 'lint:test', 'unit-test', 'unit-test:min'));
gulp.task('build', sequence('tslint', 'webpack', 'compress:logo-js', 'copy'));
gulp.task('build:app', sequence('lint:app', 'concat', 'compress:logo-app'));

gulp.task('copy', () => {
  copyFile('dist/Logo.js', `${OUTPUT_DIR}/Logo.js`);
  copyFile('dist/Logo.min.js', `${OUTPUT_DIR}/Logo.min.js`);
});

gulp.task('webpack', () => {
  return gulp.src('src/Logo.ts')
  .pipe(gulpWebpack({
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }]
    },
    resolve: {
      extensions: [ ".tsx", ".ts", ".js" ]
    },
    output: {
      filename: 'Logo.js',
      library: 'LogoJS',
      libraryExport: 'default',
      path: path.resolve(__dirname, 'dist')
    }
  }, webpack))
  .pipe(gulp.dest('dist/'));
});

function compress(src, dest, done) {
  pump([
    gulp.src(src),
    uglify(),
    rename({suffix: '.min'}),
    gulp.dest(dest)
  ], done);
}

gulp.task('compress:logo-app', (done) => {
  compress(`${OUTPUT_DIR}/${OUTPUT_FILE}`, OUTPUT_DIR, done);
});

gulp.task('compress:logo-js', (done) => {
  compress('dist/Logo.js', 'dist', done);
});

gulp.task('concat', () => {
  return gulp.src([
    'logo-app/LogoApp.js', 
    'logo-app/CanvasFactory.js', 
    'logo-app/LogoController.js'
  ])
  .pipe(concat(OUTPUT_FILE))
  .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('tslint', () => {
  return gulp.src("src/**/*.js")
  .pipe(tslint({
      formatter: "verbose"
  }))
  .pipe(tslint.report());
});

function lint(src) {
  return gulp.src(src)
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(jshint.reporter('fail'));
}

gulp.task('lint:test', () => {
  return lint(['spec/**/*.js']);
});

gulp.task('lint:app', () => {
  return lint(['logo-app/**/*.js']);
});

function karma(config) {
  let karma = path.join('node_modules', 'karma', 'bin', 'karma');
  childProcess.execSync(`node ${karma} start ${config} --single-run`, {stdio: [0,1,2]});
}

gulp.task('unit-test', () => {
  karma('');
});

gulp.task('unit-test:min', () => {
  karma('karma-min.conf.js');
});