const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const clean = require('gulp-clean');
const express = require('gulp-express');
const gls = require('gulp-live-server');
const livereload = require('gulp-livereload');
const sass = require('gulp-sass');
const path = require('path');
const del = require('del');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const fileInclude = require('gulp-file-include');
const plumber = require('gulp-plumber');
const cssnano = require('gulp-cssnano');
const minify = require('gulp-clean-css');
const cssbase64 = require('gulp-base64');
const uglify = require('gulp-uglify');
const reload = browserSync.reload;

/**
 * clean
 */

gulp.task('clean',(cb)=> {
	del(['dist/*'], cb);
});

/**
 * sass编译
 */

gulp.task('sass',()=> {
	return gulp.src('./src/assets/sass/**.scss')
	.pipe(plumber())
	.pipe(autoprefixer('last 3 version'))
	.pipe(sass({
		paths: [ path.join(__dirname, 'sass', 'includes') ]
	}).on('error', (err)=> {
		console.log('sass err:', err);
	}))
	.pipe(gulp.dest('assets/css/common'))
	.pipe(cssbase64())
	.pipe(minify())
	.pipe(gulp.dest('assets/css/common'))
});

/**
 * css文件
 */

gulp.task('css', ()=> {
	return gulp.src(['src/assets/css/**/*.css', 'src/assets/css/*.css'])
	.pipe(plumber())
	.pipe(autoprefixer('last 3 version'))
	.pipe(minify())
	.pipe(cssbase64())
	.pipe(gulp.dest('dist/assets/css'))
});

/**
 * html文件编译
 */

gulp.task('html', ()=> {
	return gulp.src(['src/**.html', 'src/**/*.html'])
	.pipe(plumber())
	.pipe(fileInclude({
		prefix: '@@',
		baspath: '@file'
	}))
	.pipe(gulp.dest('dist'))
});


/**
 * js
 */

gulp.task('js', (path)=> {
	return gulp.src(['src/assets/js/**/*.js', 'src/assets/js/*.js'])
	.pipe(plumber())
	.pipe(babel({
		presets: ['env']
	}))
	.pipe(gulp.dest('./dist/assets/js'))
	.pipe(uglify())
	.pipe(rename((path)=> {
		path.basename += '.min'
	}))
	.pipe(gulp.dest('dist/assets/js'))
});


/**
 * browserSync
 */

gulp.task('browserSync', ['nodemon', 'html', 'sass', 'js', 'css'], ()=> {
	browserSync.init(null, {
		proxy: 'http://localhost:3001',
		port: 7000
	});
	gulp.watch(['src/**.html', 'src/views/**.html'], ['html']);
	gulp.watch(['src/assets/css/**.css', 'src/assets/css/**/**.css'], ['css']);
	gulp.watch(['src/assets/js/**.js', 'src/assets/js/**/**.js'], ['js']);
})

/**
 * open express
 */

gulp.task('nodemon', (cb)=> {
	let started = false;
	return nodemon({
		script: 'bin/www'
	}).on('start', ()=> {
		if(!started) {
			cb();
			started = true;
		}
	})
});


/**
 * default
 */

gulp.task('default', ['browserSync']);

