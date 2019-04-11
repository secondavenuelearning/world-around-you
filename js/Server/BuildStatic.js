var path = require("path");
var Builder = require('systemjs-builder');

var builder = new Builder('', 'config.js');
builder.buildStatic('js/Client/viewer.js', 'output-file2.js', { minify: false, sourceMaps: false });

