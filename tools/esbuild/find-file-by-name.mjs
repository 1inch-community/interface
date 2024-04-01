import * as fs from 'fs';
import * as path from 'path';

export function findFilesByName(baseDir, fileName) {
  function recursiveSearch(dir) {
    let results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(recursiveSearch(filePath));
      } else if (file.name === fileName) {
        results.push(filePath);
      }
    }
    return results;
  }

  return recursiveSearch(baseDir);
}
