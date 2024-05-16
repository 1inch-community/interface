const fs = require('fs');
const path = require('path');

const updateVersion = (filePath, version) => {
  const file = path.resolve(filePath);
  const packageJson = JSON.parse(fs.readFileSync(file, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(file, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`Updated ${filePath} to version ${version}`);
};

const newVersion = process.argv[2];
if (!newVersion) {
  console.error('No version specified');
  process.exit(1);
}

const packageFiles = [
  'package.json',
  'apps/electron-dapp/package.json'
];

packageFiles.forEach(filePath => updateVersion(filePath, newVersion));
