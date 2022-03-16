const project_folder = 'C:/users/emmag/PycharmProjects/SocialNetwork/friends/templates',
      static_folder = 'C:/users/emmag/PycharmProjects/SocialNetwork/static',
      source_folder = 'app',
      fs = require('fs');

const path = {
    build: {
        html: project_folder + '/',
        css: static_folder + '/css/',
        js: static_folder + '/js/',
        img: static_folder + '/img/',
        fonts: static_folder + '/fonts/'
    },

    src: {
        html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'],
        css: source_folder + '/scss/friends_menu.scss',
        js: source_folder + '/js/*.js',
        img: source_folder + '/img/**/*.{png,jpg,svg,gif,ico,webp}',
        fonts: source_folder + '/fonts/*.ttf'
    },

    watch: {
        html: source_folder + '/**/*.html',
        css: source_folder + '/scss/**/*.scss',
        js: source_folder + '/js/**/*.js',
        img: source_folder + '/img/**/*.{png,jpg,svg,gif,ico,webp}',
    },

    clean_static: './' + static_folder + '/',
    clean_template: './' + static_folder + '/'
}

const {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify_es = require('gulp-uglify-es').default,
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webpHtml = require('gulp-webp-html'),
    webpcss = require('gulp-webpcss');


const browserSync = params => {
    browsersync.init({
        server: {
            baseDir: path.clean_template
        },
        port: 4000,
        notify: false
    })
}


const html = () => {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

const css = () => {
    return src(path.src.css)
        .pipe(scss({outputStyle: 'expanded'}).on('error', scss.logError))
        .pipe(group_media())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
        }))
        .pipe(webpcss())
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

const js = () => {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(babel())
        .pipe(uglify_es())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

const images = () => {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeViewBox: false}],
            optimizationLevel: 3,
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

const watchFiles = () => {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images)
}

const clean = () => {
    return (
        del(path.clean_template),
        del(path.clean_static)
    )
}

const build = gulp.series(clean, gulp.parallel(js, html, images, css))
const watch = gulp.parallel(watchFiles, build, browserSync)

exports.imgages = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
