import test from 'ava';

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
    t.is(stats.modules[0].id.endsWith('/files/nonAliased.js'), true);
    t.is(stats.modules[1].id.endsWith('/files/aliasMe.js'), true);
    t.is(stats.modules[2].id.endsWith('/files/localAliasMe.js'), true);
    t.is(stats.modules[3].id.endsWith('/files/folder/anotherNumber.js'), true);
    t.is(stats.modules[4].id.endsWith('/files/index.js'), true);
    t.is(stats.modules.length, 5);
  })
);
