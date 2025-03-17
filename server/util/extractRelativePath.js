const path = require('path');

const extractRelativePath = (fullPath) => {
  const basePath = path.join(__dirname, '..'); // Base directory
  console.log('basePath :', basePath);
  const relativePath = path.relative(basePath, fullPath).replace(/\\/g, '/'); // Normalize slashes
  console.log('relativePath :', relativePath);

  return relativePath;
};

module.exports = extractRelativePath;
