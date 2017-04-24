import test from 'ava';
import { posix as path } from 'path';
import { rollup } from 'rollup';
import alias from '../dist/rollup-plugin-alias';
import slash from 'slash';

const DIRNAME = slash(__dirname.replace(/^([A-Z]:)/, ''));
const SOME_NODE_MODULE_PATH = 'node_modules/some_libs/some_directory/some_file_alias';

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

test('Simple aliasing', t => {
  const result = alias({
    foo: 'bar',
    pony: 'paradise',
    './local': 'global',
  });

  const resolved = result.resolveId('foo', '/src/importer.js');
  const resolved2 = result.resolveId('pony', '/src/importer.js');
  const resolved3 = result.resolveId('./local', '/src/importer.js');

  t.is(resolved, 'bar');
  t.is(resolved2, 'paradise');
  t.is(resolved3, 'global');
});

test('Will not confuse modules with similar names', t => {
  const result = alias({
    foo: 'bar',
    './foo': 'bar',
  });

  const resolved = result.resolveId('foo2', '/src/importer.js');
  const resolved2 = result.resolveId('./fooze/bar', '/src/importer.js');
  const resolved3 = result.resolveId('./someFile.foo', '/src/importer.js');

  t.is(resolved, null);
  t.is(resolved2, null);
  t.is(resolved3, null);
});

test('Local aliasing', t => {
  const result = alias({
    foo: './bar',
    pony: './par/a/di/se',
  });

  const resolved = result.resolveId('foo', '/src/importer.js');
  const resolved2 = result.resolveId('foo/baz', '/src/importer.js');
  const resolved3 = result.resolveId('foo/baz.js', '/src/importer.js');
  const resolved4 = result.resolveId('pony', '/src/highly/nested/importer.js');

  t.is(resolved, '/src/bar.js');
  t.is(resolved2, '/src/bar/baz.js');
  t.is(resolved3, '/src/bar/baz.js');
  t.is(resolved4, '/src/highly/nested/par/a/di/se.js');
});

test('Absolute local aliasing', t => {
  const result = alias({
    foo: '/bar',
    pony: '/par/a/di/se.js',
  });

  const resolved = result.resolveId('foo', '/src/importer.js');
  const resolved2 = result.resolveId('foo/baz', '/src/importer.js');
  const resolved3 = result.resolveId('foo/baz.js', '/src/importer.js');
  const resolved4 = result.resolveId('pony', '/src/highly/nested/importer.js');

  t.is(resolved, '/bar.js');
  t.is(resolved2, '/bar/baz.js');
  t.is(resolved3, '/bar/baz.js');
  t.is(resolved4, '/par/a/di/se.js');
});

test('Test for the resolve property', t => {
  const result = alias({
    ember: './folder/hipster',
    resolve: ['.js', '.jsx'],
  });

  const resolved = result.resolveId('ember', path.resolve(DIRNAME, './files/index.js'));

  t.is(resolved, path.resolve(DIRNAME, './files/folder/hipster.jsx'));
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
    resolve: 'some_libs/some_directory/some_file_alias',
  });

  const resolved = result.resolveId('resolve', '/src/import.js');

  t.is(resolved, path.resolve(process.cwd(), SOME_NODE_MODULE_PATH));
});

test(t => {
  const result = alias({
    resolve: './i/am/a/local/file',
  });

  const resolved = result.resolveId('resolve', path.resolve(DIRNAME, './files/index.js'));

  t.is(resolved, path.resolve(DIRNAME, './files/i/am/a/local/file.js'));
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
      someModule: 'some_libs/some_directory/some_file_alias',
    })],
  }).then(stats => {
    t.is(stats.modules[0].id.endsWith('/files/nonAliased.js'), true);
    t.is(stats.modules[1].id.endsWith('/files/aliasMe.js'), true);
    t.is(stats.modules[2].id.endsWith('/files/localAliasMe.js'), true);
    t.is(stats.modules[3].id.endsWith('/files/folder/anotherNumber.js'), true);
    t.is(stats.modules[4].id.endsWith(SOME_NODE_MODULE_PATH), true);
    t.is(stats.modules[5].id.endsWith('/files/index.js'), true);
    t.is(stats.modules.length, 6);
  })
);
