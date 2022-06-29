const multer = require("multer");
const path = require("path");
//
function storage(directory) {
  return multer.diskStorage({
    destination: directory,
    filename: function (req, file, cb) {
      //
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
      //
    },
  });
}
//
function multerOBJ(storage) {
  return {
    storage: storage,
    limits: {
      fileSize: 8.5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    },
  };
}
//
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = filetypes.test(file.mimetype.toLowerCase());
  //
  // console.log(file);
  if (mimeType && extname) {
    return cb(null, true);
  }
  // console.log(mimeType, extname);
  cb("Error: images only!");
}

const upload = multer(multerOBJ(storage("./public/uploads"))).single("image");
const manyUploads = multer(multerOBJ(storage("./public/uploads"))).array(
  "images",
  4
);
const adminUploads = multer(multerOBJ(storage("./public/adminImages"))).array(
  "images",
  5
);
//
//

class ImageUpload {
  constructor() {
    this.single = upload;
    this.multiple = manyUploads;
    this.adminUploads = adminUploads;
  }
}
module.exports = { ImageUpload: new ImageUpload() };
