# gulp-npm-dist

Gulp plugin for listing package.json dependencies and copy dist files of them to specific folder

## Get started

### Install

```
npm install gulp-npm-dist
```

### Usage

```javascript
var gulp = require('gulp');
var npmDist = require('gulp-npm-dist');

// Copy dependencies to build/node_modules/
gulp.task('copyNpmDependenciesDist', function() {
  gulp.src(npmDist(), {base:'./'}).pipe(gulp.dest('./build'));
});
```
will create this structure:

![gulp-npm-dist build structure](https://monosnap.com/file/eImO2GxnmWTy6toAdkdTn537dwGJQC.png)