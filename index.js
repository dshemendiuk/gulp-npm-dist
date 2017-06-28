var fs = require('fs');

module.exports = function() {
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

        distFolderPos = mainFile.lastIndexOf('/dist');
        mainFileFolder = mainFile.slice(0, mainFile.lastIndexOf('/'));

        if (distFolderPos !== -1) {
          mainFileFolder = mainFile.substring(0, distFolderPos) + '/dist';
        }

      } else {
        console.log('Main file is not defined for the module ' + lib);
      }
    }


    //delete unminified versions

    function readLibFilesRecursively(target) {
      try {
        fs.readdirSync(target).forEach(function(path) {
          var fullPath = target + '/' + path;
          if (fs.lstatSync(fullPath).isDirectory()) {
            readLibFilesRecursively(fullPath);
          }
          libFiles.push(fullPath);
        });
      } catch(err) {
        console.log(err);
      }
    }

    readLibFilesRecursively(mainFileFolder);

    for (var i=0; i<libFiles.length; i++) {
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

    packages.push('!' + mainFileFolder + '/**/*.map');
    packages.push('!' + mainFileFolder + '/src/**/*');
    packages.push('!' + mainFileFolder + '/examples/**/*');
    packages.push('!' + mainFileFolder + '/example/**/*');
    packages.push('!' + mainFileFolder + '/demo/**/*');
    packages.push('!' + mainFileFolder + '/spec/**/*');
    packages.push('!' + mainFileFolder + '/docs/**/*');
    packages.push('!' + mainFileFolder + '/tests/**/*');
    packages.push('!' + mainFileFolder + '/test/**/*');
    packages.push('!' + mainFileFolder + '/**/Gruntfile.js');
    packages.push('!' + mainFileFolder + '/**/gulpfile.js');
    packages.push('!' + mainFileFolder + '/**/package.json');
    packages.push('!' + mainFileFolder + '/**/bower.json');
    packages.push('!' + mainFileFolder + '/**/composer.json');
    packages.push('!' + mainFileFolder + '/**/*.md');
    packages.push('!' + mainFileFolder + '/**/*.coffee');
    packages.push('!' + mainFileFolder + '/**/*.ts');
    packages.push('!' + mainFileFolder + '/**/*.scss');
    packages.push('!' + mainFileFolder + '/**/*.less');

    packages.push(mainFileFolder + '/**/*');

  }

  return packages;
};
