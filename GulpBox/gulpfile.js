const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const minify = require('gulp-clean-css');
const rename = require('gulp-rename');
const connect = require('gulp-connect');
const plumber = require('gulp-plumber');
//创建gulp任务，
//第一个参数为任务的名称
//第二个参数为任务所依赖的其他任务(可以省略)
//第三个参数是执行任务所要运行的代码
gulp.task('copy-index',async() =>{
	//取到指定的文件
	gulp.src('./src/index.html')
		.pipe(gulp.dest('./dist'))	
		
})

gulp.task('copy-html',async() =>{
	gulp.src('./src/html/*.html')
		.pipe(gulp.dest('./dist/html'))
})

gulp.task('copy-vendor',async() =>{
	gulp.src('./src/vendor/**/*.*')
		.pipe(gulp.dest('./dist/vendor'))
})

gulp.task('copy-assets',async() =>{
	gulp.src('./assets/**/*.*')
		.pipe(gulp.dest('./dist'))
})

gulp.task('copy',gulp.series('copy-index','copy-html','copy-vendor','copy-assets'))

gulp.task('concat',async() =>{
	gulp.src('./src/script/**/*.js')
		.pipe(concat('output.js'))
		.pipe(gulp.dest('./dist/js'))
		.pipe(babel())
		.pipe(uglify())
		.pipe(rename('./output.min.js'))
		.pipe(gulp.dest('./dist/js'));
})

gulp.task('sass',async() =>{
	gulp.src('./src/style/**/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest('./dist/css'))
		.pipe(minify())
		.pipe(rename(function(filename){
			filename.basename += '.min'
		}))
		.pipe(gulp.dest('./dist/css'))
})

gulp.task('watch', async() =>{
	gulp.watch('./src/index.html',gulp.series('copy-index'));
	gulp.watch('./src/html/**/*.html',gulp.series('copy-html'));
	gulp.watch('./src/script/**/*.js',gulp.series('concat'));
	gulp.watch('./src/style/**/*.scss',gulp.series('sass'));
	gulp.watch('./dist/**/*.*',gulp.series('reload'))

})

gulp.task('reload', async()=>{
	gulp.src('./dist/**/*.html')
		.pipe(connect.reload());
})

gulp.task('server',async() =>{
	connect.server({
		root: './dist',
		livereload: true
	})
})

gulp.task('default', gulp.series('watch','server'),async() =>{

})