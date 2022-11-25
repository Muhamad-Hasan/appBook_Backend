var multer = require('multer');

//multer.diskStorage() creates a storage space for storing files. 
var storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log(file);
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, './assets/images');
        }
        if (file.mimetype === 'video/mp4') {
            cb(null, './assets/videos');
        }
    },
    
    filename: (req, file, cb) => {
        let filename = file.originalname.split('.');
        cb(null, filename[0] + '_' + new Date().getTime() + '.' + filename[1])
    },

})

var upload = multer({ storage: storageImage});
module.exports = upload;
