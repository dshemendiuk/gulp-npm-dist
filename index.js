var fs = require('fs');

module.exports = function() {
  var buffer, packageJson, packages;
  
  buffer = fs.readFileSync('./package.json');
  packageJson = JSON.parse(buffer.toString());
  packages = [];
  
  for (package in packageJson.dependencies) {
    var depPackageBuffer = fs.readFileSync('./node_modules/' + package + '/package.json');
    var depPackage = JSON.parse(depPackageBuffer.toString());

    if (depPackage.main) {
      var mainFile = './node_modules/' + package + '/' + depPackage.main;
      var mainFileFolder = mainFile.slice(0, mainFile.lastIndexOf('/'));
      var distFolderPos = mainFile.lastIndexOf('/dist'); 

      if (distFolderPos !== -1) {
        mainFileFolder = mainFile.substring(0, distFolderPos) + '/dist'; 
      }

      packages.push(mainFileFolder + '/**/*.*');
      packages.push('!' + mainFileFolder + '/**/*.map');
      
    } else {
      console.log('Main file is not defined for the module ' + package);
      packages.push('./node_modules/' + package + '/**/*');
    } 
  }

  return packages;
};

