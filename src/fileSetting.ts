import multer from 'multer';
var storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, './memes');
  },
  filename: (_, file, cb) => {
    console.log(file);
    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  },
});

const upload = multer({ storage: storage });

export default upload.single('file');
