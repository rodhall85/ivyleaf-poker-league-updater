const gulp = require('gulp');
const run = require('gulp-run');

gulp.task('watch', ['tests'], () => {
  console.log('Watching...');
  return gulp.watch('tests/**/*.js', ['tests']);
});

gulp.task('tests', () => {
  console.log('Running tests...');
  return run('npm run test').exec();
});
