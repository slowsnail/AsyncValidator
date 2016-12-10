'use strict'

let gulp = require('gulp')
let sass = require('gulp-sass')
let rename = require('gulp-rename')
let browserSync = require('browser-sync').create({server: true})
let reload = browserSync.reload
let nodemon = require('gulp-nodemon')
let path = require('path')
let browserify = require('browserify')
let babelify = require("babelify")
let buffer = require('vinyl-buffer')
let uglify = require('gulp-uglifyjs')
let source = require('vinyl-source-stream')

let config = require('./config')

let baseDir = './'
let srcDir = './src'
let sassDir = './sass'
let demoDir = './demo'

let filePath = {
	js: path.join(srcDir, '**/*.js'),
	scss: path.join(baseDir, 'sass/**/*.scss')
}

let demoWatch = {
	index: path.join(demoDir, 'index.html'),
	js: path.join(demoDir, 'js/**/*.js'),
	scss: path.join(sassDir, '**/*.scss')
}

let demoDestPath = {
	js: './demo/js/',
	css: './demo/css'
}

gulp.task('demo:server', function() {
	nodemon({
		script: './bin/www',
		ignore: ['node_modules'],
		env: {
			'NODE_ENV': 'demo'
		}
	})

	browserSync.init({
		proxy: 'http://localhost:' + config.port,
		files: [demoWatch.index],
		notify: true,
		open: true,
		port: 5000
	})

	gulp.watch(filePath.js, ['demo-watch'] )
	gulp.watch(demoWatch.scss, ['css'])
})

gulp.task('css', function () {
  return gulp.src(path.join('./sass/index.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({
		suffix: '.min'
	}))
    .pipe(gulp.dest(demoDestPath.css))
    .pipe(reload({stream: true}))
})


gulp.task('build-demo-js', function() {
	return browserify({entries: './src/index.js' , debug: true })
		.transform(babelify, {presets: ["es2015"]})
		.bundle()
		.on("error", function(err) {
          var reg = /(.*\/)(.*)(?= while)/

          console.log("[Error]: " + err.message);
          this.emit("end");
        })
		.pipe(source('index.js'))
		.pipe(buffer())
		//.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(demoDestPath.js))
})

gulp.task('demo-watch', ['build-demo-js'], function(done) {
	done()
})

gulp.task('demo', ['demo:server', 'build-demo-js', 'css'])






