const fs = require('fs');
const path = require('path');

const makeFolderIfDoesNotExist = (folder) => {
  const fullPath = path.join(__dirname, '..', folder);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true }); // Create the folder if it doesn't exist.
  }
};

module.exports = makeFolderIfDoesNotExist;
