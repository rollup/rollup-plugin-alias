import test from 'ava';

import path from 'path';

import { rollup } from 'rollup';
import alias from '../dist/rollup-plugin-alias';

test(t =>
  rollup({
    entry: './files/index.js',
    plugins: [alias({
      fancyNumber: './aliasMe',
      './anotherFancyNumber': './localAliasMe',
      numberFolder: './folder',
      './numberFolder': './folder',
    })],
  }).then(stats => {
    t.is(path.basename(stats.modules[0].id), 'nonAliased.js');
    t.is(path.basename(stats.modules[1].id), 'aliasMe.js');
    t.is(path.basename(stats.modules[2].id), 'localAliasMe.js');
    t.is(path.basename(stats.modules[3].id), 'anotherNumber.js');
    t.is(path.basename(stats.modules[4].id), 'index.js');
    t.is(stats.modules.length, 5);
  })
);
