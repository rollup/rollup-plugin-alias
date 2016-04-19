# rollup-plugin-alias
Define aliases when bundling packages with Rollup.

[![Build Status](https://travis-ci.org/frostney/rollup-plugin-alias.svg?branch=master)](https://travis-ci.org/frostney/rollup-plugin-alias) [![Dependency Status](https://david-dm.org/frostney/rollup-plugin-alias.svg)](https://david-dm.org/frostney/rollup-plugin-alias) [![devDependency Status](https://david-dm.org/frostney/rollup-plugin-alias/dev-status.svg)](https://david-dm.org/frostney/rollup-plugin-alias#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/frostney/rollup-plugin-alias/badge.svg?branch=master)](https://coveralls.io/github/frostney/rollup-plugin-alias?branch=master)

When we write tests, we may want an easier way to access the local library we are testing or mocking libraries. We may also define aliases to counteract "require hell" and get rid of all those `../../../` imports we may have in the process.

For Webpack users: This is a plugin to have a `resolve.alias` functionality in Rollup.

## Installation
```
npm install rollup-plugin-alias
```

## Usage
```javascript
import { rollup } from 'rollup';
import alias from 'rollup-plugin-alias';

rollup({
  entry: './src/index.js',
  plugins: [alias({
    somelibrary: './mylocallibrary'
  })],
});
```

An optional `resolve` array with file extensions can be provided.
If present local aliases beginning with `./` will be resolved to existing files:

```javascript
import { rollup } from 'rollup';
import alias from 'rollup-plugin-alias';

rollup({
  entry: './src/index.js',
  plugins: [alias({
    resolve: ['.jsx', '.js']
    foo: './bar',  // Will check for ./bar.jsx and ./bar.js
  })],
});
```
If not given local aliases will be resolved with a `.js` extension.

## License
MIT, see `LICENSE` for more information
