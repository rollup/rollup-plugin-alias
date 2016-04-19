import path from 'path';

// Helper functions
const noop = () => null;
// const identity = a => a;
const startsWith = (needle, haystack) => ! haystack.indexOf(needle);

export default function alias(options = {}) {
  const aliasKeys = Object.keys(options);

  // No aliases?
  if (!aliasKeys.length) {
    return {
      resolveId: noop,
    };
  }

  return {
    resolveId(importee, importer) {
      // First match is supposed to be the correct one
      const toReplace = aliasKeys.find(key => startsWith(key, importee));

      if (!toReplace) {
        return null;
      }

      const entry = options[toReplace];

      const updatedId = importee.replace(toReplace, entry);

      if (updatedId.indexOf('./') === 0) {
        // const basename = path.basename(importer);
        // const directory = importer.split(basename)[0];
        const directory = path.dirname(importer);

        // TODO: Is there a way not to have the extension being defined explicitly?
        return path.resolve(directory, updatedId) + '.js';
      }

      return updatedId;
    },
  };
}
