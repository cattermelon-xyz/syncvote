const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const foldersToCheck = ['middleware', 'redux', 'pages', 'components'];

function isDirectory(filePath) {
  return fs.statSync(filePath).isDirectory();
}

function getImportsFromFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const importLines = fileContent.match(/import .+ from ['"].+['"]/g) || [];
  return importLines;
}

function checkImportsFromFolder(folderPath, callback) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    if (isDirectory(filePath)) {
      checkImportsFromFolder(filePath, callback); // Recursive check for directories
    } else {
      callback(filePath);
    }
  }
}
function isInsidePagesFragmentsFolder(filePath) {
  const relativePath = path.relative(srcDir, filePath);
  const containingFolder = path.dirname(relativePath);
  const parts = containingFolder.split(path.sep); // Sử dụng path.sep thay vì '/' để đảm bảo tính tương thích tr across platforms
  return parts.length > 2 && parts[0] === 'pages' && parts[2] === 'fragments';
}

function checkImports() {
  for (const folder of foldersToCheck) {
    const folderPath = path.join(srcDir, folder);
    checkImportsFromFolder(folderPath, (filePath) => {
      const imports = getImportsFromFile(filePath);
      for (const importLine of imports) {
        if (folder === 'components') {
          if (
            importLine.includes('pages') ||
            importLine.includes('middleware') ||
            importLine.includes('redux')
          ) {
            console.error(`Components: Error in ${filePath}: ${importLine}`);
          }
        } else if (folder === 'redux') {
          if (
            importLine.includes('pages') ||
            importLine.includes('middleware') ||
            importLine.includes('components')
          ) {
            console.error(`Redux: Error in ${filePath}: ${importLine}`);
          }
        } else if (folder === 'middleware') {
          if (
            importLine.includes('pages') ||
            importLine.includes('components')
          ) {
            console.error(`Middleware: Error in ${filePath}: ${importLine}`);
          }
        } else if (folder === 'pages') {
          if (importLine.includes('redux')) {
            if (
              !importLine.includes('react-redux') &&
              !importLine.includes('@redux/reducers/ui.reducer')
            ) {
              console.error(`Pages: Error in ${filePath}: ${importLine}`);
            }
          }
          if (isInsidePagesFragmentsFolder(filePath)) {
            if (importLine.includes('pages')) {
              console.error(`Fragment: Error in ${filePath}: ${importLine}`);
            }
          }
        }
      }
    });
  }
}

checkImports();
