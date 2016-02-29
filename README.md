# rollup-plugin-alias
Define aliases when bundling packages with Rollup.

[![Build Status](https://travis-ci.org/frostney/rollup-plugin-alias.svg?branch=master)](https://travis-ci.org/frostney/rollup-plugin-alias) [![Dependency Status](https://david-dm.org/frostney/rollup-plugin-alias.svg)](https://david-dm.org/frostney/rollup-plugin-alias) [![devDependency Status](https://david-dm.org/frostney/rollup-plugin-alias/dev-status.svg)](https://david-dm.org/frostney/rollup-plugin-alias#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/frostney/rollup-plugin-alias/badge.svg?branch=master)](https://coveralls.io/github/frostney/rollup-plugin-alias?branch=master)

## Installation
```
npm install rollup-plugin-alias
```

## Usage
```
import { rollup } from 'rollup';
import alias from 'rollup-plugin-alias';

rollup({
  entry: './src/index.js',
  plugins: [alias({
    somelibrary: './mylocallibrary'
  })],
});
```

## License
MIT, see `LICENSE` for more information
