const multer = require('multer');
const path = require('path');

const makeFolderIfDoesNotExist = require('../util/makeFolder');

const upload = ({
  allowedMimeTypes,
  uploadType,
  fieldName,
  maxFiles = 1,
  maxSize = 2,
  targetFolder,
  masterFolder = 'uploads',
}) => {
  // Make sure the folder exists
  makeFolderIfDoesNotExist(`${masterFolder}/${targetFolder}`);

  // Configure storage for uploaded files
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', masterFolder, targetFolder);
      cb(null, uploadPath); // Dynamically set upload folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = file.fieldname + '-' + new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
      const sanitizedFilename = uniqueSuffix.replace(/\s+/g, '_'); // Replace spaces with underscore
      cb(null, sanitizedFilename);
    },
  });

  // Define file filter
  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      const allowedExtensions = fileTypes.map((type) => type.split('/')[1]).join(', ');
      cb(new Error(`Only image files with ${allowedExtensions} extensions are allowed`), false);
    }
  };

  // Configure Multer
  const uploadMulter = multer({
    storage: fileStorage,
    fileFilter,
    limits: { fileSize: maxSize * 1024 * 1024 }, // Convert MB to bytes
  });

  // Choose upload method dynamically
  if (uploadType === 'single') {
    return uploadMulter.single(fieldName);
  } else if (uploadType === 'multiple') {
    return uploadMulter.array(fieldName, maxFiles);
  } else {
    throw new Error("Invalid upload type. Use 'single' or 'multiple'.");
  }
};

module.exports = { upload };
