var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

var pathsConfig = {
    js: {
        src: 'js/*.js',
        dest: 'build/js'
    },
    css: {
        src: 'css/*.styl',
        dest: 'build/css'
    },
    img: {
        src: 'img/**/*.*',
        dest: 'build/img'
    },
    html: {
        src: '*.html',
        dest: 'build'
    },
    vendors: {
        src: 'bower_components/**/*.*',
        dest: 'build/bower_components'
    }
};

gulp.task('vendors', function () {
    return gulp.src(pathsConfig.vendors.src)
        .pipe(gulp.dest(pathsConfig.vendors.dest))
});

gulp.task('js', function () {
    return gulp.src(pathsConfig.js.src)
        .pipe(plugins.uglify())
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest(pathsConfig.js.dest))
});

gulp.task('css', function () {
    return gulp.src(pathsConfig.css.src)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.stylus({
            compress: true
        }))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(pathsConfig.css.dest))
});

gulp.task('img', function () {
    return gulp.src(pathsConfig.img.src)
        .pipe(gulp.dest(pathsConfig.img.dest))
});

gulp.task('html', function () {
    return gulp.src(pathsConfig.html.src)
        .pipe(gulp.dest(pathsConfig.html.dest))
});

gulp.task('run', function () {
    plugins.connect.server({
        root: 'build'
    });
});

gulp.task('bower', function () {
    return plugins.bower();
});

gulp.task('build', ['js', 'css', 'html', 'img', 'vendors']);

gulp.task('watch', function () {
    gulp.watch(['*.html', 'js/**/*.js', 'css/*.styl', 'img/**/*.*'], ['build']);
    gulp.watch('js/**/*.js', ['build']);
    gulp.watch('css/*.styl', ['build']);
    gulp.watch('img/**/*.*', ['build']);
});

gulp.task('default', ['bower', 'build', 'watch', 'run']);

