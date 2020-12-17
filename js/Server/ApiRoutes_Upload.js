const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ValidateUser = require('./ValidateUser.js');
// const ffmpeg = require('ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

let uploadRoutes = function(app){
	// Set Storage Engine
	const storage = multer.diskStorage({
		destination: 'uploads',
		filename: function(req, file, cb) {
			req.params.fileName = req.params.fileName.replace(/ /g, '');
			if(file.mimetype.match(/video/gi)){
				// if a video save a temporary file to later be converted
				cb(null, req.params.fileName + '.mp4');
			}
			else{
				// if an image save the file as is
				cb(null, req.params.fileName + path.extname(file.originalname).toLowerCase());
			}
		}
	});

	// set the filer function
	const filter = function(req, file, cb){
		if(file.mimetype.match(/image|video/gi)){
			return cb(null, true);
		}
		return cb('Error: invalid file type uploaded.');
	}

	// Init upload
	const upload = multer({
		storage: storage,
		limits: {
			fileSize:1000000000 // 1GB max
		},
		fileFilter: filter
	}).single('file');

	app.post('/api/file/:fileName', ValidateUser, (req, res) => {
		upload(req, res, (err) => {
			if(err) {
				req.error(err);
			}
			else {
				// console.log(req.file);
				if(req.file == undefined) {
					req.error('upload error', 405, 'no file selected.');
				}
				else {
					if(req.file.mimetype.match(/video/gi)){
						// get the paths to the original file and the tempoary file
						let originalPath = `${__dirname}/../../${req.file.path}`,
						tempPath = `${__dirname}/../../uploads/temp/${req.params.fileName}.mp4`;

						// begin converting the new file to an audio-less file
							ffmpeg(originalPath).noAudio()
							.on('error', function(err) {
								req.error(err, false);
							})
							.on('end', function() {
							// move the newly created file to the correct place and delete the temp file
							fs.copyFileSync(tempPath, originalPath);
							fs.unlinkSync(tempPath);
						})
							.save(tempPath);
						}
					return res.send(`${req.file.path}`);
				}
			}
		});
	});
}


module.exports = uploadRoutes;