const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getLastUpdateTimesForPath(directoryPath, blacklist = ['__test__']) {
  const componentUpdates = {};

  // Ensure the directory exists
  if (!fs.existsSync(directoryPath)) {
    console.error(`Directory ${directoryPath} does not exist.`);
    return componentUpdates;
  }

  // Recursively get all files in the directory
  function getAllFiles(dir) {
    const files = fs.readdirSync(dir);
    let fileList = [];

    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      // Skip blacklisted directories
      if (stat.isDirectory()) {
        const dirName = path.basename(fullPath);
        if (blacklist.includes(dirName)) {
          return;
        }
        fileList = fileList.concat(getAllFiles(fullPath));
      } else {
        fileList.push(fullPath);
      }
    });

    return fileList;
  }

  // Get all files in the directory
  const allFiles = getAllFiles(directoryPath);

  // Track last update time for each file
  allFiles.forEach(filePath => {
    try {
      // Get the last commit time for the file
      const relativePath = path.relative(process.cwd(), filePath);
      const gitCommand = `git log -1 --format=%ct -- "${relativePath}"`;
      const lastCommitTimestamp = parseInt(execSync(gitCommand).toString().trim());

      // Get the file's last modification time as a fallback
      const fileStats = fs.statSync(filePath);
      const fileModTime = Math.floor(fileStats.mtime.getTime() / 1000);

      // Use the most recent timestamp
      const lastUpdateTime = Math.max(lastCommitTimestamp || 0, fileModTime);

      // Store the path relative to the components directory
      const relativePaths = path.relative(directoryPath, filePath);
      componentUpdates[relativePaths] = lastUpdateTime;
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  });

  return componentUpdates;
}

function main() {
  const componentsPath = 'src/components/oxbow/';
  const outputPath = 'src/data/updates.json';

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get last update times
  const componentUpdates = getLastUpdateTimesForPath(componentsPath);

  // Write to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(componentUpdates, null, 2));

  console.log(`Updated component timestamps written to ${outputPath}`);
}

// Run the script
main();