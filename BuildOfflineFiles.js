var path = require("path");
var Builder = require('systemjs-builder');

function GetBuilder(){
	let builder = new Builder('', 'config.js');
	builder.config({
		separateCSS: false,
		buildCSS: true
	});
	return builder;
}

GetBuilder().buildStatic('js/Client/Header.js', 'js/Offline/Header_Offline.js', { minify: false, sourceMaps: false }).then(function() {
	console.log('Header_Offline.js Build Complete.');
	GetBuilder().buildStatic('js/Client/Viewer.js', 'js/Offline/Viewer_Offline.js', { minify: false, sourceMaps: false }).then(function() {
		console.log('Viewer_Offline.js Build Complete.');
		console.log('Build Complete.');
	});
});
