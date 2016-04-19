import path from 'path';

// Helper functions
const noop = () => null;
// const identity = a => a;

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
      // TODO: We shouldn't have a case of double aliases. But may need to handle that better
      const filteredAlias = aliasKeys.filter(value => importee.indexOf(value) === 0)[0];

      if (!filteredAlias) {
        return null;
      }

      const entry = options[filteredAlias];

      const updatedId = importee.replace(filteredAlias, entry);

      if (updatedId.indexOf('./') === 0) {
        const basename = path.basename(importer);
        const directory = importer.split(basename)[0];

        // TODO: Is there a way not to have the extension being defined explicitly?
        return path.resolve(directory, updatedId) + '.js';
      }

      return updatedId;
    },
  };
}
