# rollup-plugin-alias
Define aliases when bundling packages with Rollup.

[![Build Status](https://travis-ci.org/rollup/rollup-plugin-alias.svg?branch=master)](https://travis-ci.org/rollup/rollup-plugin-alias) [![Dependency Status](https://david-dm.org/frostney/rollup-plugin-alias.svg)](https://david-dm.org/frostney/rollup-plugin-alias) [![devDependency Status](https://david-dm.org/frostney/rollup-plugin-alias/dev-status.svg)](https://david-dm.org/frostney/rollup-plugin-alias#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/frostney/rollup-plugin-alias/badge.svg?branch=master)](https://coveralls.io/github/frostney/rollup-plugin-alias?branch=master)

Let's take a simple import as an example:

```javascript
import something from '../../../something';

something();
```

This probably doesn't look too bad on its own. But imagine this is not the only instance in your code base and after a refactor/restructuring this might fall over. With this plugin in place, you can alias `../../../something` with `something` for readability. In case of a refactor only the alias would need to be changed instead of navigating through the code base and changing all imports.

```javascript
import something from 'something';

something();
```

When we write tests, we may want an easier way to access the local library we are testing or mocking libraries. We may also define aliases to counteract "require hell" and get rid of all those `../../../` imports we may have in the process.

For Webpack users: This is a plugin to mimic the `resolve.alias` functionality in Rollup.

## Installation
```
$ npm install rollup-plugin-alias
```
#
## Usage
```javascript
// rollup.config.js
import alias from 'rollup-plugin-alias';

export default {
  input: './src/index.js',
  plugins: [
    alias({
      resolve: ['.jsx', '.js'], //optional, by default this will just look for .js files or folders
      entries:[
        {find:'something', replacement: '../../../something'}, //the initial example
        {find:'somelibrary-1.0.0', replacement: './mylocallibrary-1.5.0'}, //remap a library with a specific version
        {find:/^i18n\!(.*)/, replacement: '$1.js'}, //remove something in front of the import and append an extension (e.g. loaders, for files that were previously transpiled via the AMD module, to properly handle them in rollup as internals now)
        //for whatever reason, replace all .js extensions with .wasm
        {find:/^(.*)\.js$/, replacement: '$1.wasm'}
      ]
    })
  ],
};

// or with object syntax
export default {
  input: './src/index.js',
  plugins: [
    alias({
      resolve: ['.jsx', '.js'],
      entries: {
        something: '../../../something',
        'somelibrary-1.0.0': './mylocallibrary-1.5.0',
      }
    })
  ],
};
```
The order of the entries is important, in that the first rules are applied first.

You can use either simple Strings or Regular Expressions to search in a more distinct and complex manner (e.g. to do partial replacements via subpattern-matching, see aboves example).

## License
MIT, see `LICENSE` for more information
