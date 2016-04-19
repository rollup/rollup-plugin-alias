import test from 'ava';

import { rollup } from 'rollup';
import alias from '../dist/rollup-plugin-alias';

test(t => {
  t.is(typeof alias, 'function');
});

test(t => {
  const result = alias();
  t.is(typeof result, 'object');
  t.is(typeof result.resolveId, 'function');
});

test(t => {
  const result = alias({});
  t.is(typeof result, 'object');
  t.is(typeof result.resolveId, 'function');
});

// Simple aliasing
test(t => {
  const result = alias({
    foo: 'bar',
    pony: 'paradise',
  });

  const resolved = result.resolveId('foo', '/src/importer.js');
  const resolved2 = result.resolveId('pony', '/src/importer.js');

  t.is(resolved, 'bar');
  t.is(resolved2, 'paradise');
});

// Local aliasing
test(t => {
  const result = alias({
    foo: './bar',
    pony: './par/a/di/se',
  });

  const resolved = result.resolveId('foo', '/src/importer.js');
  const resolved2 = result.resolveId('pony', '/src/highly/nested/importer.js');

  t.is(resolved, '/src/bar.js');
  t.is(resolved2, '/src/highly/nested/par/a/di/se.js');
});

// Tests in Rollup
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
