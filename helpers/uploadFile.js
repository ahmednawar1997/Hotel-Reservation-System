var multer  = require('multer');
var path = require('path');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'public/uploads/')
	},
	filename: function (req, file, cb) {
	  cb(null, Date.now() + path.extname(file.originalname))
	}
  })
  
  module.exports = storage; 