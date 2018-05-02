'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = require('path');
var path__default = _interopDefault(path);
var os = require('os');
var fs = _interopDefault(require('fs'));
var slash = _interopDefault(require('slash'));

const VOLUME = /^([A-Z]:)/;
const IS_WINDOWS = os.platform() === 'win32';

// Helper functions
const noop = () => null;
const matches = (key, importee) => {
  if (importee.length < key.length) {
    return false;
  }
  if (importee === key) {
    return true;
  }
  const importeeStartsWithKey = (importee.indexOf(key) === 0);
  const importeeHasSlashAfterKey = (importee.substring(key.length)[0] === '/');
  return importeeStartsWithKey && importeeHasSlashAfterKey;
};
const endsWith = (needle, haystack) => haystack.slice(-needle.length) === needle;
const isFilePath = id => /^\.?\//.test(id);
const exists = uri => {
  try {
    return fs.statSync(uri).isFile();
  } catch (e) {
    return false;
  }
};

const normalizeId = id => {
  if ((IS_WINDOWS && typeof id === 'string') || VOLUME.test(id)) {
    return slash(id.replace(VOLUME, ''));
  }

  return id;
};

function alias(options = {}) {
  const hasResolve = Array.isArray(options.resolve);
  const resolve = hasResolve ? options.resolve : ['.js'];
  const aliasKeys = hasResolve ?
                      Object.keys(options).filter(k => k !== 'resolve') : Object.keys(options);

  // No aliases?
  if (!aliasKeys.length) {
    return {
      resolveId: noop,
    };
  }

  return {
    resolveId(importee, importer) {
      const importeeId = normalizeId(importee);
      const importerId = normalizeId(importer);

      // First match is supposed to be the correct one
      const toReplace = aliasKeys.find(key => matches(key, importeeId));

      if (!toReplace || !importerId) {
        return null;
      }

      const entry = options[toReplace];

      let updatedId = normalizeId(importeeId.replace(toReplace, entry));

      if (isFilePath(updatedId)) {
        const directory = path.posix.dirname(importerId);

        // Resolve file names
        const filePath = path.posix.resolve(directory, updatedId);

        const match = resolve.map(ext => (endsWith(ext, filePath) ? filePath : `${filePath}${ext}`))
                            .find(exists);

        if (match) {
          updatedId = match;
        // To keep the previous behaviour we simply return the file path
        // with extension
        } else if (endsWith('.js', filePath)) {
          updatedId = filePath;
        // See if filePath + /index.js exists, then use it
        } else if (fs.existsSync(path.posix.join(filePath, 'index.js'))) {
          updatedId = path.posix.join(filePath, 'index.js');
        } else {
          updatedId = filePath + '.js';
        }
      }

      // if alias is windows absoulate path return resolved path or
      // rollup on windows will throw:
      //  [TypeError: Cannot read property 'specifier' of undefined]
      if (VOLUME.test(entry)) {
        return path__default.resolve(updatedId);
      }

      return updatedId;
    },
  };
}

module.exports = alias;
