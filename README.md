# gulp-npm-dist

Gulp plugin for listing package.json dependencies

## Get started

### Install

```
npm install gulp-npm-dist
```

### Examples

```javascript
var gulp = require('gulp');
var npmDist = require('gulp-npm-dist');

// Copy dependencies to build/node_modules/
gulp.task('copyNpmDependenciesDist', function() {
  gulp.src(npmDist(), {base:'./'}).pipe(gulp.dest('./build'));
});
```