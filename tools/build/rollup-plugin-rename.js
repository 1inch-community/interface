export default function renameOutput(handler) {
  return {
    name: 'rename-output',
    generateBundle(outputOptions, bundle) {
      const fileNames = Object.keys(bundle);
      for (const fileName of fileNames) {
        const newName = handler(fileName)
        if (newName && newName !== fileName) {
          const file = bundle[fileName];
          delete bundle[fileName];
          file.fileName = newName;
          bundle[newName] = file;
        }
      }
    },
  };
}