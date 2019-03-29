var path = require("path");
var Builder = require('systemjs-builder');

// optional constructor options
// sets the baseURL and loads the configuration file
//var builder = new Builder('C:/Users/tsmith.CORP/Documents/SourceCode/WorldAroundYou', 'path/to/system/config-file.js');
/*
builder
.bundle('local/module.js', 'outfile.js')
.then(function() {
  console.log('Build complete');
})
.catch(function(err) {
  console.log('Build error');
  console.log(err);
});


var builder = new Builder({
  baseURL: '../../',
  map: {
  } // etc. config
});

*/
var builder = new Builder('', 'config.js');
/*
builder.loadConfig('../../config.js')
.then(function() {

  // ready to build
});
*/
builder.buildStatic('js/Client/viewer.js', 'output-file.js', { minify: false, sourceMaps: false });

//builder.bundle('app/* - app/corelibs.js', 'output-file.js', { minify: false, sourceMaps: true });
