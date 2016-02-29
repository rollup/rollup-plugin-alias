import path from 'path';

export default function alias(options = {}) {
  return {
    resolveId(importee, importer) {
      if (Object.keys(options).length === 0) {
        return null;
      }

      const aliasKeys = Object.keys(options);
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
