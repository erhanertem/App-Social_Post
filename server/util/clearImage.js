const path = require('path');
const fs = require('fs');

const clearImage = function (filePath) {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => {
    // fs.unlink returns null even if there is no erro for the error object. So we need an iff check here.
    if (err) {
      console.log('Error deleting file', err);
    } else {
      console.log('File deleted successfully');
    }
  });
};

module.exports = clearImage;
