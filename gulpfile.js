var gulp = require('gulp');
var uglify = require('gulp-uglify');
var debug = require('gulp-debug');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');

//Process : clean -> compile -> copy:libs

// clean the contents of the distribution directory
gulp.task('clean:app', function () {
  return del('dist/app/**/*');
});


gulp.task('clean:libs', function () {
  return del('dist/lib/**/*');
});

// TypeScript compile
//Sourcemaps are used to de-reference uglified code in production code
gulp.task('compile', ['clean:app'], function () {
  return gulp.src(tscConfig.files)
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('dist/app'));
    // .pipe(sourcemaps.init())          // <--- sourcemaps
    // .pipe(typescript(tscConfig.compilerOptions))
    // .pipe(sourcemaps.write('.'))      // <--- sourcemaps
    // .pipe(gulp.dest('dist/app'));
});

// copy dependencies
gulp.task('copy:libs', ['clean:libs'], function() {
  return gulp.src([
      "node_modules/core-js/client/shim.min.js",
      "node_modules/zone.js/dist/zone.js",
      "node_modules/reflect-metadata/Reflect.js",
      "node_modules/systemjs/dist/system.src.js"
    ])
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('uglify', ["compile"], function() {
    return gulp.src("dist/app/**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest('dist/app'));
});

gulp.task('copy:assets', function() {
  return gulp.src(['app/**/*', 'index.html', 'public/app/*.css', '!app/**/*.ts'], { base : './' })
    .pipe(gulp.dest('dist'))
});

gulp.task('tsconfig-glob', function () {
  return tsconfig({
    configPath: '.',
    indent: 2
  });
});

gulp.task('clean', ['clean:app', 'clean:libs']);
gulp.task('build', ['uglify']);
gulp.task('default', ['build']);