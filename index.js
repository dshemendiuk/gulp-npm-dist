var fs = require('fs');

var excludePatterns = [
  '/**/*.map',
  '/src/**/*',
  '/examples/**/*',
  '/example/**/*',
  '/demo/**/*',
  '/spec/**/*',
  '/docs/**/*',
  '/tests/**/*',
  '/test/**/*',
  '/**/Gruntfile.js',
  '/**/gulpfile.js',
  '/**/package.json',
  '/**/bower.json',
  '/**/composer.json',
  '/**/*.md',
  '/**/*.coffee',
  '/**/*.ts',
  '/**/*.scss',
  '/**/*.less'
];

module.exports = function (config) {
  config = config || {};

  var copyUnminified = config.copyUnminified || false;
  var excludes = excludePatterns.concat(config.excludes) || excludePatterns;

  var buffer = fs.readFileSync('./package.json');
  var packageJson = JSON.parse(buffer.toString());
  var packages = [];

  for (lib in packageJson.dependencies) {
    var mainFileFolder = './node_modules/' + lib;
    var libFiles = [];

    if (fs.existsSync(mainFileFolder + '/dist')) {
      mainFileFolder = mainFileFolder + '/dist';
    } else {
      var depPackageBuffer = fs.readFileSync('./node_modules/' + lib + '/package.json');
      var depPackage = JSON.parse(depPackageBuffer.toString());

      if (depPackage.main) {
        var mainFile = mainFileFolder + '/' + depPackage.main;
        var distFolderPos;

        distFolderPos = mainFile.lastIndexOf('/dist/');
        mainFileFolder = mainFile.slice(0, mainFile.lastIndexOf('/'));

        if (distFolderPos !== -1) {
          mainFileFolder = mainFile.substring(0, distFolderPos) + '/dist';
        }

      } else {
        console.log('Main file is not defined for the module ' + lib);
      }
    }

    function readLibFilesRecursively(target) {
      try {
        fs.readdirSync(target).forEach(function (path) {
          var fullPath = target + '/' + path;
          if (fs.lstatSync(fullPath).isDirectory()) {
            readLibFilesRecursively(fullPath);
          }
          libFiles.push(fullPath);
        });
      } catch (err) {
        console.log(err);
      }
    }

    readLibFilesRecursively(mainFileFolder);

    if (copyUnminified === false) {
      // Delete unminified versions
      for (var i = 0; i < libFiles.length; i++) {
        var target;
        if (libFiles[i].indexOf('.min.js') > -1) {
          target = libFiles[i].replace(/\.min\.js/, '.js');
          packages.push('!' + libFiles[libFiles.indexOf(target)]);
        }
        if (libFiles[i].indexOf('.min.css') > -1) {
          target = libFiles[i].replace(/\.min\.css/, '.css');
          packages.push('!' + libFiles[libFiles.indexOf(target)]);
        }
      }
    }

    // Excludes
    excludes.map(function (value) {
      packages.push('!' + mainFileFolder + value);
    });
    // Includes
    packages.push(mainFileFolder + '/**/*');
  }

  return packages;
};
