
var gulp      = require('gulp'),
gutil         = require('gulp-util' ),
sass          = require('gulp-sass'),
browserSync   = require('browser-sync'),
concat        = require('gulp-concat'),
uglify        = require('gulp-uglify'),
cleancss      = require('gulp-clean-css'),
cssnano      = require('gulp-cssnano'),
rename        = require('gulp-rename'),
autoprefixer  = require('gulp-autoprefixer'),
notify        = require("gulp-notify"),
rsync         = require('gulp-rsync'),
imagemin     = require('gulp-imagemin'),
imageminJpegRecompress 
						 = require('imagemin-jpeg-recompress'),
pngquant     = require('imagemin-pngquant'),
cache        = require('gulp-cache'),
rigger       = require('gulp-rigger'),
del          = require('del');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});
gulp.task('html', function () {
	return gulp.src('app/html/*.html') 
	.pipe(rigger()) 
	.pipe(gulp.dest('app')) 
	.pipe(browserSync.reload({stream: true})) 
});

gulp.task('sass', function() {
	return gulp.src('app/scss/style.scss')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	// .pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/owl.carousel/dist/owl.carousel.min.js',
		'app/libs/swiper/dist/js/swiper.min.js',
		// 'app/libs/bootstrap/dist/js/bootstrap.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		'app/libs/revealator/fm.revealator.jquery.min.js',
		'app/libs/jquery-validation/dist/jquery.validate.min.js',
		'app/libs/jQueryFormStyler/dist/jquery.formstyler.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'));
});

// gulp.task('rsync', function() {
// 	return gulp.src('app/**')
// 	.pipe(rsync({
// 		root: 'app/',
// 		hostname: 'username@yousite.com',
// 		destination: 'yousite/public_html/',
// 		// include: ['*.htaccess'], // Includes files to deploy
// 		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
// 		recursive: true,
// 		archive: true,
// 		silent: false,
// 		compress: true
// 	}))
// });

gulp.task('watch', ['browser-sync', 'html', 'sass', 'scripts'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/html/**/*.html', ['html']);
	gulp.watch('app/js/*.js', browserSync.reload);
});
// gulp.task('default', ['watch']);

gulp.task('css-libs', ['sass'], function() {
  return gulp.src('app/css/style.css')
    .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('clean', function() {
  return del.sync('dist');
});
gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imageminJpegRecompress({
      loops: 5,
      min: 65,
      max: 70,
      quality:'medium',
      method: 'smallfry',
      progressive: 'true', 
      strip: 'true'
    }),
    imagemin.svgo(),
    imagemin.optipng({optimizationLevel: 4}),
    pngquant({quality: '65-70', speed: 5})
	  ],{
    verbose: true,
    svgoPlugins: [{removeViewBox: false}],
  })))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'css-libs', 'scripts'], function() {
  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'))
  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
	// var buildVideo = gulp.src('app/video/*')
	// 	.pipe(gulp.dest('dist/video'));
});
gulp.task('clear', function () {
	return cache.clearAll();
});

