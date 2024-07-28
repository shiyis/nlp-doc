const fs = require('fs-extra');
const path = require('path');

// Define the paths
const sourceDir = path.join(__dirname);
const deployDir = path.join(__dirname, '.deploy_git');

// Copy all files from the Hexo project to the deployment directory
fs.copySync(sourceDir, deployDir, {
  filter: (src) => {
    // Exclude node_modules and the deploy directory itself
    if (src.includes('node_modules') || src.includes('.deploy_git') || src.includes('.git')) {
      return false;
    }
    return true;
  }
});

console.log('All necessary files copied to the deployment directory.');
