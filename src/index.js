import path from 'path';

export default function alias(options = {}) {
  return {
    resolveId(importee, importer) {
      if (Object.keys(options).length === 0) {
        return null;
      }

      const aliasKeys = Object.keys(options);
      const aliasIndex = aliasKeys.indexOf(importee);

      if (aliasIndex >= 0) {
        const entry = options[aliasKeys[aliasIndex]];

        if (entry.indexOf('./') === 0) {
          const basename = path.basename(importer);
          const directory = importer.split(basename)[0];

          // TODO: Is there a way not to have the extension being defined explicitly?
          return path.resolve(directory, entry) + '.js';
        }

        return entry;
      }

      return null;
    },
  };
}
