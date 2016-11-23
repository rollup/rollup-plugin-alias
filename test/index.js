import test from 'ava';
import path from 'path';
import { rollup } from 'rollup';
import alias from '../dist/rollup-plugin-alias';
import os from 'os';
const isWin = os.platform() === 'win32';
const root = isWin ? 'F:\\' : '/';

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
  const resolved2 = result.resolveId('foo/baz', '/src/importer.js');
  const resolved3 = result.resolveId('foo/baz.js', '/src/importer.js');
  const resolved4 = result.resolveId('pony', '/src/highly/nested/importer.js');

  t.is(resolved, path.resolve(root, '/src/bar.js'));
  t.is(resolved2, path.resolve(root, '/src/bar/baz.js'));
  t.is(resolved3, path.resolve(root, '/src/bar/baz.js'));
  t.is(resolved4, path.resolve(root, '/src/highly/nested/par/a/di/se.js'));
});

// Absolute local aliasing
test(t => {
  const result = alias({
    foo: '/bar',
    pony: '/par/a/di/se.js',
  });

  const resolved = result.resolveId('foo', '/src/importer.js');
  const resolved2 = result.resolveId('foo/baz', '/src/importer.js');
  const resolved3 = result.resolveId('foo/baz.js', '/src/importer.js');
  const resolved4 = result.resolveId('pony', '/src/highly/nested/importer.js');

  t.is(resolved, path.resolve(root, '/bar.js'));
  t.is(resolved2, path.resolve(root, '/bar/baz.js'));
  t.is(resolved3, path.resolve(root, '/bar/baz.js'));
  t.is(resolved4, path.resolve(root, '/par/a/di/se.js'));
});

// Test for the resolve property
test(t => {
  const result = alias({
    ember: './folder/hipster',
    resolve: ['.js', '.jsx'],
  });

  const resolved = result.resolveId('ember', path.resolve(__dirname, './files/index.js'));

  t.is(resolved, path.resolve(__dirname, './files/folder/hipster.jsx'));
});

test(t => {
  const result = alias({
    resolve: 'i/am/a/file',
  });

  const resolved = result.resolveId('resolve', '/src/import.js');

  t.is(resolved, 'i/am/a/file');
});

test(t => {
  const result = alias({
    resolve: './i/am/a/local/file',
  });

  const resolved = result.resolveId('resolve', path.resolve(__dirname, './files/index.js'));

  t.is(resolved, path.resolve(__dirname, './files/i/am/a/local/file.js'));
});

// Tests in Rollup
test('Tests in Rollup', t =>
  rollup({
    entry: isWin ? './test/files/index.js' : './files/index.js',
    plugins: [alias({
      fancyNumber: './aliasMe',
      './anotherFancyNumber': './localAliasMe',
      numberFolder: './folder',
      './numberFolder': './folder',
    })],
  }).then(stats => {
    if (isWin) {
      t.is(stats.modules[0].id.endsWith('\\files\\nonAliased.js'), true);
      t.is(stats.modules[1].id.endsWith('\\files\\aliasMe.js'), true);
      t.is(stats.modules[2].id.endsWith('\\files\\localAliasMe.js'), true);
      t.is(stats.modules[3].id.endsWith('\\files\\folder\\anotherNumber.js'), true);
      t.is(stats.modules[4].id.endsWith('\\files\\index.js'), true);
    } else {
      t.is(stats.modules[0].id.endsWith('/files/nonAliased.js'), true);
      t.is(stats.modules[1].id.endsWith('/files/aliasMe.js'), true);
      t.is(stats.modules[2].id.endsWith('/files/localAliasMe.js'), true);
      t.is(stats.modules[3].id.endsWith('/files/folder/anotherNumber.js'), true);
      t.is(stats.modules[4].id.endsWith('/files/index.js'), true);
    }
    t.is(stats.modules.length, 5);
  })
);
